import { NextRequest, NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";
import { verifyPayUResponseHash, PAYU_CONFIG } from "@/lib/payu";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    const { txnid, mihpayid, status, bank_ref_num, bankcode, error, error_Message } =
      params;

    // --- Verify hash ---
    const isHashValid = verifyPayUResponseHash(params, PAYU_CONFIG.SALT);

    const finalStatus = !isHashValid
      ? "HASH_MISMATCH"
      : status === "failure"
      ? "FAILED"
      : "CANCELLED";
    console.log("[payment/failure] Hash valid:", isHashValid, "Final status:", finalStatus);
    // --- Update DB ---
    const pool = await getDbPool();
    await pool
      .request()
      .input("txn_id", sql.NVarChar(100), txnid)
      .input("payment_status", sql.NVarChar(50), finalStatus)
      .input("payu_payment_id", sql.NVarChar(150), mihpayid || null)
      .input("bank_ref_num", sql.NVarChar(150), bank_ref_num || null)
      .input("gateway_response_code", sql.NVarChar(50), bankcode || error || null)
      .input("gateway_response_message", sql.NVarChar(sql.MAX), error_Message || "Payment failed")
      .input("response_payload", sql.NVarChar(sql.MAX), JSON.stringify(params))
      .input("remarks", sql.NVarChar(sql.MAX), `PayU status: ${status}`)
      .execute("sp_updateOrder");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const reason = encodeURIComponent(error_Message || error || "Payment was not completed");

    return NextResponse.redirect(
      `${appUrl}/payment/failure?txnid=${txnid || ""}&reason=${reason}`
    );
  } catch (err) {
    console.error("[payment/failure] Error:", err);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/payment/failure?reason=server_error`);
  }
}

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return NextResponse.redirect(`${appUrl}/payment/failure?reason=invalid_request`);
}