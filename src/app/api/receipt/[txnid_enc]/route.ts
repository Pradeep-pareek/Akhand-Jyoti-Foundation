// app/api/receipt/[token]/route.ts
// Verifies the signed token, fetches the txn from DB,
// and returns raw certificate HTML with window.print() auto-trigger.

import { NextRequest, NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";
import { buildCertificateHTML } from "@/lib/certificate-template";
import { verifyReceiptToken } from "@/lib/receipt-token";

export async function GET(
  _req: NextRequest,
  { params }: { params: { txnid_enc: string } }
) {
  const { txnid_enc } = params;
  console.log("[api/receipt] Request for txnid_enc:", txnid_enc);
  // ── 1. Verify token ────────────────────────────────────────────────────
  const txnid = verifyReceiptToken(txnid_enc);
  if (!txnid) {
    return new NextResponse(errorHtml("Invalid or expired receipt link.", "The link you used is invalid or may have been tampered with. Please use the exact link from your email."), {
      status: 403,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
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
    console.log("[api/receipt] DB query result for txnid", txnid, ":", txn);
  } catch (err) {
    console.error("[api/receipt] DB error:", err);
    return new NextResponse(errorHtml("Server error.", "Something went wrong on our end. Please try again later or contact support."), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
  // ── 3. Not found / not successful ─────────────────────────────────────
  if (!txn) {
    return new NextResponse(
      errorHtml(
        "Receipt not found.",
        `No successful payment was found for transaction <strong>${txnid}</strong>.<br/>
         If you believe this is an error, please contact us at
         <a href="mailto:info@akhandjyotifoundation.org">info@akhandjyotifoundation.org</a>.`
      ),
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // ── 4. Build & return certificate HTML ────────────────────────────────
  const html = buildCertificateHTML(txn);

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Frame-Options": "SAMEORIGIN",
      // Cache for 1 hour — certificate content doesn't change often
      "Cache-Control": "private, max-age=3600",
    },
  });
}

// ─── Error page ───────────────────────────────────────────────────────────────
function errorHtml(title: string, detail: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{
      font-family:Arial,sans-serif;min-height:100vh;
      display:flex;align-items:center;justify-content:center;
      background:#f4f4f4;
    }
    .card{
      background:#fff;border-radius:14px;
      padding:48px 40px;text-align:center;
      box-shadow:0 4px 24px rgba(0,0,0,0.08);
      max-width:440px;width:100%;margin:20px;
    }
    .icon{font-size:48px;margin-bottom:16px;}
    h2{color:#1B5E20;font-size:20px;margin-bottom:12px;}
    p{color:#666;font-size:14px;line-height:1.75;}
    a{color:#2E7D32;}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔒</div>
    <h2>${title}</h2>
    <p>${detail}</p>
  </div>
</body>
</html>`;
}