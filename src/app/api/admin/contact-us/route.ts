import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export async function GET() {
    try {

        const pool = await getDbPool();

        const result = await pool.request().query(`
            SELECT
                ContactID,
                FirstName,
                LastName,
                Email,
                Phone,
                Message,
                IsRead,
                CreatedDate
            FROM ContactUs
            ORDER BY ContactID DESC
        `);

        return NextResponse.json({
            success: true,
            data: result.recordset
        });

    } catch (error) {

        return NextResponse.json({
            success: false,
            message: "Failed to load data"
        });
    }
}