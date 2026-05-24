
import { NextRequest, NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";
import { verifyPayUResponseHash, PAYU_CONFIG } from "@/lib/payu";

// Helper — never returns null, uses request origin as fallback
function getAppUrl(req: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && envUrl !== "null" && envUrl !== "") {
    try {
      // Validate envUrl
      new URL(envUrl.startsWith("http") ? envUrl : `https://${envUrl}`);
      return envUrl.replace(/\/$/, "");
    } catch (e) {
      console.warn("[payment/failure] Invalid NEXT_PUBLIC_APP_URL:", envUrl);
    }
  }
  // Fallback: derive from the incoming request URL itself
  try {
    const url = new URL(req.url);
    return `${url.protocol}//${url.host}`;
  } catch (e) {
    console.error("[payment/failure] Could not determine appUrl from request", req.url);
    return "/"; // fallback to root
  }
}

export async function POST(req: NextRequest) {
  const appUrl = getAppUrl(req);
  if (!appUrl || appUrl === "null") {
    console.error("[payment/failure] appUrl is invalid:", appUrl);
    return NextResponse.json({ error: "Server misconfiguration: invalid appUrl" }, { status: 500 });
  }
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    const { txnid, mihpayid, status, bank_ref_num, bankcode, error, error_Message } = params;

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

    const reason = encodeURIComponent(error_Message || error || "Payment was not completed");
    return NextResponse.redirect(
      `${appUrl}/payment/failure?txnid=${txnid || ""}&reason=${reason}`,
      303
    );
  } catch (err) {
    console.error("[payment/failure] Error:", err);
    return NextResponse.redirect(`${appUrl}/payment/failure?reason=server_error`, 303);
  }
}

export async function GET(req: NextRequest) {
  const appUrl = getAppUrl(req);
  return NextResponse.redirect(`${appUrl}/payment/failure?reason=invalid_request`, 303);
}