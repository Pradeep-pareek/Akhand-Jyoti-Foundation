import { NextRequest, NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const status = searchParams.get("status") || "ALL";
        const search = searchParams.get("search") || "";
        const dateFrom = searchParams.get("dateFrom") || "";
        const dateTo = searchParams.get("dateTo") || "";
        const amountMin = searchParams.get("amountMin") || "";
        const amountMax = searchParams.get("amountMax") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "20");
        const offset = (page - 1) * pageSize;

        const pool = await getDbPool();
        const request = pool.request();

        let where = "WHERE 1=1";

        if (status !== "ALL") {
            where += " AND payment_status = @status";
            request.input("status", sql.NVarChar(50), status);
        }
        if (search) {
            where += " AND (donor_name LIKE @search OR donor_email LIKE @search OR donor_phone LIKE @search OR txn_id LIKE @search)";
            request.input("search", sql.NVarChar(200), `%${search}%`);
        }
        if (dateFrom) {
            where += " AND CAST(created_at AS DATE) >= @dateFrom";
            request.input("dateFrom", sql.Date, new Date(dateFrom));
        }
        if (dateTo) {
            where += " AND CAST(created_at AS DATE) <= @dateTo";
            request.input("dateTo", sql.Date, new Date(dateTo));
        }
        if (amountMin) {
            where += " AND amount >= @amountMin";
            request.input("amountMin", sql.Decimal(18, 2), parseFloat(amountMin));
        }
        if (amountMax) {
            where += " AND amount <= @amountMax";
            request.input("amountMax", sql.Decimal(18, 2), parseFloat(amountMax));
        }

        request.input("pageSize", sql.Int, pageSize);
        request.input("offset", sql.Int, offset);

        const result: any = await request.query(`
      SELECT
        transaction_id, txn_id, donor_name, donor_email, donor_phone,
        amount, payment_status, payu_payment_id, bank_ref_num,
        gateway_response_message, created_at, updated_at
      FROM ajf_transaction ${where}
      ORDER BY created_at DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;

      SELECT COUNT(*) AS total FROM ajf_transaction ${where};

      SELECT
        COUNT(*) AS total_txns,
        SUM(CASE WHEN payment_status='SUCCESS' THEN 1 ELSE 0 END) AS successful,
        SUM(CASE WHEN payment_status='FAILED'  THEN 1 ELSE 0 END) AS failed,
        SUM(CASE WHEN payment_status='SUCCESS' THEN amount ELSE 0 END) AS total_amount
      FROM ajf_transaction ${where};
    `);

        return NextResponse.json({
            success: true,
            donations: result.recordsets[0],
            pagination: { page, pageSize, total: result.recordsets[1][0].total, totalPages: Math.ceil(result.recordsets[1][0].total / pageSize) },
            summary: result.recordsets[2][0],
        });
    } catch (err) {
        console.error("[admin/donations] Error:", err);
        return NextResponse.json({ success: false, error: "Failed to fetch donations." }, { status: 500 });
    }
}