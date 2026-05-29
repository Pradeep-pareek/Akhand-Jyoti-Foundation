// app/api/admin/reverify/route.ts
// Calls PayU's Verify Payment API and updates the order in the DB

import { NextRequest, NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";
import { PAYU_CONFIG } from "@/lib/payu";
import crypto from "crypto";

interface PayUVerifyResponse {
  status: number;
  msg: string;
  transaction_details?: Record<string, {
    status: string;
    mihpayid: string;
    bank_ref_num: string;
    bankcode: string;
    error_Message: string;
  }>;
}

function buildVerifyHash(txnid: string, key: string, salt: string): string {
  // PayU verify hash: sha512(key|command|var1|salt)
  const raw = `${key}|verify_payment|${txnid}|${salt}`;
  return crypto.createHash("sha512").update(raw).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { txnid } = await req.json();

    if (!txnid) {
      return NextResponse.json({ error: "txnid is required" }, { status: 400 });
    }

    const hash = buildVerifyHash(txnid, PAYU_CONFIG.KEY, PAYU_CONFIG.SALT);

    // Call PayU Verify Payment API
    const payuUrl = PAYU_CONFIG.IS_PRODUCTION
      ? "https://info.payu.in/merchant/postservice?form=2"
      : "https://test.payu.in/merchant/postservice?form=2";

    const formData = new URLSearchParams({
      key: PAYU_CONFIG.KEY,
      command: "verify_payment",
      var1: txnid,
      hash,
    });

    const payuRes = await fetch(payuUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!payuRes.ok) {
      return NextResponse.json(
        { error: `PayU API error: ${payuRes.status}` },
        { status: 502 }
      );
    }

    const payuData: PayUVerifyResponse = await payuRes.json();

    const txnDetails = payuData.transaction_details?.[txnid];

    if (!txnDetails) {
      return NextResponse.json(
        { error: "No transaction details returned by PayU", payuData },
        { status: 404 }
      );
    }

    const newStatus = txnDetails.status?.toUpperCase() === "SUCCESS" ? "SUCCESS" : txnDetails.status?.toUpperCase() || "FAILED";

    // Update DB
    const pool = await getDbPool();
    await pool.request()
      .input("txn_id", sql.NVarChar(100), txnid)
      .input("payment_status", sql.NVarChar(50), newStatus)
      .input("payu_payment_id", sql.NVarChar(150), txnDetails.mihpayid || null)
      .input("bank_ref_num", sql.NVarChar(150), txnDetails.bank_ref_num || null)
      .input("gateway_response_code", sql.NVarChar(50), txnDetails.bankcode || null)
      .input("gateway_response_message", sql.NVarChar(sql.MAX), txnDetails.error_Message || "Reverified via admin")
      .input("response_payload", sql.NVarChar(sql.MAX), JSON.stringify(payuData))
      .input("remarks", sql.NVarChar(sql.MAX), "Manual reverification via admin panel")
      .execute("sp_updateOrder");

    return NextResponse.json({ success: true, newStatus, txnid });
  } catch (err) {
    console.error("[admin/reverify] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}