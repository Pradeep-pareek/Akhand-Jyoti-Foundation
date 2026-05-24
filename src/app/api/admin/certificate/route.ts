import { NextRequest, NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";
import puppeteer from "puppeteer";
import { buildCertificateHTML } from "@/lib/certificate-template";

export async function GET(req: NextRequest) {
    const txnId = new URL(req.url).searchParams.get("txnid");
    if (!txnId) return NextResponse.json({ error: "txnid required" }, { status: 400 });

    try {
        const pool = await getDbPool();
        const result = await pool.request()
            .input("txn_id", sql.NVarChar(100), txnId)
            .query(`SELECT * FROM ajf_transaction WHERE txn_id = @txn_id`);

        const txn = result.recordset[0];
        if (!txn)
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        if (txn.payment_status !== "SUCCESS")
            return NextResponse.json({ error: "Certificate only available for successful donations" }, { status: 400 });

        const html = buildCertificateHTML(txn);

        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page: any = await browser.newPage();

        // Load HTML and wait for Google Fonts to load
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,   // needed for colored backgrounds
            margin: { top: "0", right: "0", bottom: "0", left: "0" },
        });

        await browser.close();

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="80G-Certificate-${txnId}.pdf"`,
            },
        });
    } catch (err) {
        console.error("[certificate] Error:", err);
        return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 });
    }
}