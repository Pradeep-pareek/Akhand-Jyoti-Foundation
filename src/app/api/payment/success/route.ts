import { NextRequest, NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";
import { verifyPayUResponseHash, PAYU_CONFIG } from "@/lib/payu";
import type { DonationEmailPayload } from "@/app/api/send-donation-email/route";

// Helper — never returns null, uses request origin as fallback
function getAppUrl(req: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && envUrl !== "null" && envUrl !== "") {
    try {
      // Validate envUrl
      new URL(envUrl.startsWith("http") ? envUrl : `https://${envUrl}`);
      return envUrl.replace(/\/$/, "");
    } catch (e) {
      console.warn("[payment/success] Invalid NEXT_PUBLIC_APP_URL:", envUrl);
    }
  }
  // Fallback: derive from the incoming request URL itself
  try {
    const url = new URL(req.url);
    return `${url.protocol}//${url.host}`;
  } catch (e) {
    console.error("[payment/success] Could not determine appUrl from request", req.url);
    return "/"; // fallback to root
  }
}

/**
 * Fire-and-forget helper: calls the internal /api/send-donation-email route.
 * Any failure is logged but NEVER bubbles up to break the payment redirect.
 */
async function triggerDonationEmail(
  appUrl: string,
  payload: DonationEmailPayload
): Promise<void> {
  try {
    const res = await fetch(`${appUrl}/api/send-donation-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error("[payment/success] Email API responded with error:", res.status, body);
    } else {
      console.log("[payment/success] Donation email triggered for txnid:", payload.txnid);
    }
  } catch (err) {
    console.error("[payment/success] Failed to call email API:", err);
  }
}

export async function POST(req: NextRequest) {
  const appUrl = getAppUrl(req);
  if (!appUrl || appUrl === "null") {
    console.error("[payment/success] appUrl is invalid:", appUrl);
    return NextResponse.json({ error: "Server misconfiguration: invalid appUrl" }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    const { txnid, mihpayid, status, amount, bank_ref_num, bankcode, error, error_Message } = params;
    const { email: donorEmail, firstname: donorFirstName, lastname: donorLastName } = params;

    const isHashValid = verifyPayUResponseHash(params, PAYU_CONFIG.SALT);

    if (!isHashValid) {
      const pool = await getDbPool();
      await pool.request()
        .input("txn_id", sql.NVarChar(100), txnid)
        .input("payment_status", sql.NVarChar(50), "HASH_MISMATCH")
        .input("response_payload", sql.NVarChar(sql.MAX), JSON.stringify(params))
        .input("remarks", sql.NVarChar(sql.MAX), "Hash mismatch on success callback")
        .execute("sp_updateOrder");

      return NextResponse.redirect(`${appUrl}/payment/failure?txnid=${txnid}&reason=hash_mismatch`, 303);
    }

    const finalStatus = status === "success" ? "SUCCESS" : "FAILED";

    const pool = await getDbPool();
    await pool.request()
      .input("txn_id", sql.NVarChar(100), txnid)
      .input("payment_status", sql.NVarChar(50), finalStatus)
      .input("payu_payment_id", sql.NVarChar(150), mihpayid || null)
      .input("bank_ref_num", sql.NVarChar(150), bank_ref_num || null)
      .input("gateway_response_code", sql.NVarChar(50), bankcode || null)
      .input("gateway_response_message", sql.NVarChar(sql.MAX), error_Message || "Payment successful")
      .input("response_payload", sql.NVarChar(sql.MAX), JSON.stringify(params))
      .input("remarks", sql.NVarChar(sql.MAX), `PayU status: ${status}`)
      .execute("sp_updateOrder");

    if (finalStatus === "SUCCESS") {
      // ── Send donation confirmation email (non-blocking) ───────────────────
      if (donorEmail) {
        const donorName = [donorFirstName, donorLastName].filter(Boolean).join(" ").trim();
        triggerDonationEmail(appUrl, {
          toEmail: donorEmail,
          toName: donorName,
          txnid,
          amount,
          mihpayid,
        });
      } else {
        console.warn("[payment/success] No donor email in PayU params; skipping email for txnid:", txnid);
      }
      // ─────────────────────────────────────────────────────────────────────

      return NextResponse.redirect(
        `${appUrl}/payment/success?txnid=${txnid}&amount=${amount}&mihpayid=${mihpayid}`,
        303
      );
    } else {
      return NextResponse.redirect(
        `${appUrl}/payment/failure?txnid=${txnid}&reason=${encodeURIComponent(error_Message || error || "Payment failed")}`,
        303
      );
    }
  } catch (err) {
    console.error("[payment/success] Error:", err);
    return NextResponse.redirect(`${appUrl}/payment/failure?reason=server_error`, 303);
  }
}

export async function GET(req: NextRequest) {
  const appUrl = getAppUrl(req);
  return NextResponse.redirect(`${appUrl}/payment/failure?reason=invalid_request`, 303);
}