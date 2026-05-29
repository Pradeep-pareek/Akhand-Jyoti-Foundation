// src/app/api/admin/homepage/[section]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db"; // adjust path to your db helper

// ─── GET /api/admin/homepage/:section ────────────────────────────────────────
export async function GET(
    _req: NextRequest,
    { params }: { params: { section: string } }
) {
    try {
        const pool = await getDbPool();
        const result = await pool
            .request()
            .input("section_key", params.section)
            .query(
                `SELECT section_data FROM homepage_content WHERE section_key = @section_key`
            );

        if (result.recordset.length === 0) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }

        const data = JSON.parse(result.recordset[0].section_data);
        return NextResponse.json({ success: true, data });
    } catch (err) {
        console.error("GET homepage section error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// ─── PUT /api/admin/homepage/:section ────────────────────────────────────────
export async function PUT(
    req: NextRequest,
    { params }: { params: { section: string } }
) {
    try {
        const body = await req.json();
        const pool = await getDbPool();

        await pool
            .request()
            .input("section_key", params.section)
            .input("section_data", JSON.stringify(body))
            .query(`
                UPDATE homepage_content
                SET section_data = @section_data,
                    updated_at   = GETDATE()
                WHERE section_key = @section_key
            `);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("PUT homepage section error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}