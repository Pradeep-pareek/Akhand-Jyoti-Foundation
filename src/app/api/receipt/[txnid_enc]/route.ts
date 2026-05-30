// app/api/receipt/[token]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";
import { verifyReceiptToken } from "@/lib/receipt-token";

export async function GET(
  _req: NextRequest,
  { params }: { params: { txnid_enc: string } }
) {
  const { txnid_enc } = params;
  // ── 1. Verify token ────────────────────────────────────────────────────
  const txnid = verifyReceiptToken(txnid_enc);
  if (!txnid) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  // ── 2. Fetch transaction from DB ───────────────────────────────────────
  let txn: Record<string, unknown> | null = null;
  try {
    const pool = await getDbPool();
    const result = await pool.request()
      .input("txn_id", sql.NVarChar(100), txnid)
      .query(`
        SELECT *
        FROM   dbo.ajf_transaction
        WHERE  txn_id         = @txn_id
          AND  payment_status = 'SUCCESS'
      `);

    if (result.recordset.length > 0) {
      txn = result.recordset[0] as Record<string, unknown>;
    }
    return NextResponse.json(txn);
    
  } catch (err) {
    console.error("[api/receipt] DB error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

