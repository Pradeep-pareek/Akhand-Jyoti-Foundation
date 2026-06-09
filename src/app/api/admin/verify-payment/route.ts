import { getDbPool, sql } from "@/lib/db";
import verifyPayuTransaction from "@/lib/verify_payment";
import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// PayU error_code → human readable message
// Source: https://docs.payu.in/reference/error-codes
// ─────────────────────────────────────────────────────────────────────────────
const PAYU_ERROR_CODES: Record<string, string> = {
    // ── Success ──────────────────────────────────────────────────────────────
    E000: "Transaction successful",

    // ── Timeout / Bounce ─────────────────────────────────────────────────────
    E408: "Transaction timed out — page expired due to no user input (bounced)",

    // ── User / Session ───────────────────────────────────────────────────────
    E001: "User cancelled the transaction",
    E002: "Transaction dropped — user did not complete payment",
    E003: "Duplicate transaction",
    E005: "Transaction already processed",

    // ── Authentication / 3DS ─────────────────────────────────────────────────
    E501: "Authentication failed — incorrect OTP",
    E502: "OTP expired",
    E503: "OTP attempts exhausted",
    E504: "3DS authentication failed",
    E505: "Card authentication failed — bank declined",
    E506: "VBV / Mastercard SecureCode authentication failed",

    // ── Card / Bank declines ─────────────────────────────────────────────────
    E101: "Insufficient funds",
    E102: "Card blocked or frozen",
    E103: "Card expired",
    E104: "Invalid card number",
    E105: "Card not enabled for online transactions",
    E106: "Card limit exceeded",
    E107: "Card type not supported",
    E108: "Invalid CVV",
    E109: "Bank declined — do not honour",
    E110: "Bank declined — restricted card",
    E111: "Bank declined — card lost or stolen",
    E112: "Bank declined — closed account",
    E113: "Bank declined — invalid account",
    E114: "Bank declined — transaction not permitted on card",
    E115: "Bank declined — exceeds withdrawal amount limit",
    E116: "Bank declined — exceeds withdrawal frequency limit",
    E117: "Bank declined — transaction not supported",
    E118: "Bank declined — invalid merchant",
    E119: "Bank declined — security violation",
    E120: "Bank declined — format error",
    E121: "Bank declined — system malfunction",

    // ── Net banking ──────────────────────────────────────────────────────────
    E201: "Net banking login failed",
    E202: "Net banking — insufficient balance",
    E203: "Net banking — session expired",
    E204: "Net banking — bank server error",
    E205: "Net banking — transaction declined by bank",

    // ── UPI ──────────────────────────────────────────────────────────────────
    E301: "UPI — invalid VPA",
    E302: "UPI — VPA not registered",
    E303: "UPI — transaction limit exceeded",
    E304: "UPI — insufficient balance",
    E305: "UPI — user rejected the collect request",
    E306: "UPI — transaction declined by bank",
    E307: "UPI — timeout waiting for user response",
    E308: "UPI — duplicate transaction",
    E309: "UPI — bank server unavailable",

    // ── Wallet ───────────────────────────────────────────────────────────────
    E401: "Wallet — insufficient balance",
    E402: "Wallet — transaction limit exceeded",
    E403: "Wallet — account not active",

    // ── EMI ──────────────────────────────────────────────────────────────────
    E601: "EMI not available on this card",
    E602: "EMI — bank declined",
    E603: "EMI — invalid tenure",

    // ── Merchant / Integration ───────────────────────────────────────────────
    E700: "Hash mismatch — possible tampering",
    E701: "Invalid merchant key",
    E702: "Merchant account suspended",
    E703: "IP not whitelisted",
    E704: "Invalid request parameters",
    E705: "Amount mismatch",
    E706: "Currency not supported",

    // ── Risk / Fraud ─────────────────────────────────────────────────────────
    E801: "Transaction blocked — fraud risk",
    E802: "Card flagged for fraud",
    E803: "Velocity check failed",

    // ── Refund ───────────────────────────────────────────────────────────────
    E901: "Refund failed — original transaction not found",
    E902: "Refund amount exceeds original transaction",
    E903: "Refund already processed",
    E904: "Refund not accepted for this transaction type",

    // ── System ───────────────────────────────────────────────────────────────
    E999: "Unknown error — contact PayU support",
};

// ─────────────────────────────────────────────────────────────────────────────
// Map PayU status + unmappedstatus → your internal DB status
// ─────────────────────────────────────────────────────────────────────────────
type InternalStatus = "SUCCESS" | "FAILED" | "PENDING" | "BOUNCED" | "CANCELLED" | "DROPPED";

function resolveInternalStatus(
    status: string,
    unmappedstatus: string,
    errorCode: string
): InternalStatus {
    // unmappedstatus is more granular — prefer it
    switch (unmappedstatus?.toLowerCase()) {
        case "captured":
            return "SUCCESS";
        case "bounced":
            return "BOUNCED";       // timed out, no user input (E408)
        case "dropped":
            return "DROPPED";       // user closed mid-payment
        case "failed":
        case "failure":
            return "FAILED";
        case "pending":
            return "PENDING";
        case "cancelled":
        case "canceled":
            return "CANCELLED";     // user explicitly cancelled (E001)
    }

    // Fallback to top-level status
    switch (status?.toLowerCase()) {
        case "success":   return "SUCCESS";
        case "failure":   return "FAILED";
        case "pending":   return "PENDING";
        default:          return "FAILED";
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const txnid = searchParams.get("txnid");

        if (!txnid) {
            return NextResponse.json({ success: false, message: "Transaction ID required" }, { status: 400 });
        }

        // ── 1. Call PayU verify_payment ───────────────────────────────────────
        const result = await verifyPayuTransaction(txnid);

        if (!result || result.status === 0) {
            return NextResponse.json({
                success: false,
                message: "Transaction not found in PayU",
                payu_response: result,
            }, { status: 404 });
        }

        // ── 2. Extract transaction details ───────────────────────────────────
        const txnDetails = result?.transaction_details?.[txnid];

        if (!txnDetails || txnDetails.mihpayid === "Not Found") {
            return NextResponse.json({
                success: false,
                message: "Transaction details not found",
            }, { status: 404 });
        }

        const {
            mihpayid,
            bank_ref_num,
            bankcode,
            status,
            unmappedstatus,
            error_code,
            error_Message,
            amt,
            mode,
            field9,         // raw bank response message
        } = txnDetails;

        // ── 3. Resolve final status ──────────────────────────────────────────
        const finalStatus   = resolveInternalStatus(status, unmappedstatus, error_code);
        const errorMessage  = PAYU_ERROR_CODES[error_code] ?? error_Message ?? "Unknown error";
        const remarks       = `PayU status: ${status} | unmapped: ${unmappedstatus} | code: ${error_code} | ${errorMessage}${field9 ? ` | bank: ${field9}` : ""}`;

        // ── 4. Update DB via stored procedure ────────────────────────────────
        const pool = await getDbPool();
        await pool.request()
            .input("txn_id",                   sql.NVarChar(100),      txnid)
            .input("payment_status",           sql.NVarChar(50),       finalStatus)
            .input("payu_payment_id",          sql.NVarChar(150),      mihpayid ?? null)
            .input("bank_ref_num",             sql.NVarChar(150),      bank_ref_num ?? null)
            .input("gateway_response_code",    sql.NVarChar(50),       error_code ?? bankcode ?? null)
            .input("gateway_response_message", sql.NVarChar(sql.MAX),  errorMessage)
            .input("response_payload",         sql.NVarChar(sql.MAX),  JSON.stringify(txnDetails))
            .input("remarks",                  sql.NVarChar(sql.MAX),  remarks)
            .execute("sp_updateOrder");

        // ── 5. Return response ───────────────────────────────────────────────
        return NextResponse.json({
            success: true,
            payment_status:   finalStatus,
            payu_payment_id:  mihpayid ?? null,
            bank_ref_num:     bank_ref_num ?? null,
            error_code:       error_code ?? null,
            error_message:    errorMessage,
            mode:             mode ?? null,
            amount:           amt ?? null,
        });

    } catch (err) {
        console.error("[verify-payment]", err);
        return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 });
    }
}