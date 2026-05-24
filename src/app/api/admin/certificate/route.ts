import { NextRequest, NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";
import { buildCertificateHTML } from "@/lib/certificate-template";

export async function GET(req: NextRequest) {
    const txnId = new URL(req.url).searchParams.get("txnid");

    if (!txnId) {
        return NextResponse.json(
            { error: "txnid required" },
            { status: 400 }
        );
    }

    try {
        const pool = await getDbPool();

        const result = await pool
            .request()
            .input("txn_id", sql.NVarChar(100), txnId)
            .query(`
                SELECT * 
                FROM ajf_transaction 
                WHERE txn_id = @txn_id
            `);

        const txn = result.recordset[0];

        if (!txn) {
            return NextResponse.json(
                { error: "Transaction not found" },
                { status: 404 }
            );
        }

        if (txn.payment_status !== "SUCCESS") {
            return NextResponse.json(
                {
                    error:
                        "Certificate only available for successful donations",
                },
                { status: 400 }
            );
        }

        const html = buildCertificateHTML(txn);

        return new NextResponse(html, {
            status: 200,
            headers: {
                "Content-Type": "text/html",
            },
        });
    } catch (err) {
        console.error("[certificate] Error:", err);

        return NextResponse.json(
            { error: "Failed to generate certificate" },
            { status: 500 }
        );
    }
}