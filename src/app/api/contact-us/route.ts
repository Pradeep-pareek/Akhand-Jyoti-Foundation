import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";
import { getDbPool } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            firstName,
            lastName,
            email,
            phone,
            message,
        } = body;

        if (!firstName || !email) {
            return NextResponse.json({
                success: false,
                message: "Required fields missing",
            });
        }

        const pool = await getDbPool();

        await pool.request()
            .input("FirstName", sql.NVarChar, firstName)
            .input("LastName", sql.NVarChar, lastName || "")
            .input("Email", sql.NVarChar, email)
            .input("Phone", sql.NVarChar, phone || "")
            .input("Message", sql.NVarChar(sql.MAX), message || "")
            .query(`
                INSERT INTO ContactUs
                (
                    FirstName,
                    LastName,
                    Email,
                    Phone,
                    Message
                )
                VALUES
                (
                    @FirstName,
                    @LastName,
                    @Email,
                    @Phone,
                    @Message
                )
            `);

        return NextResponse.json({
            success: true,
            message: "Message sent successfully"
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json({
            success: false,
            message: "Internal server error"
        });
    }
}