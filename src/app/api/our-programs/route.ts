// src/app/api/admin/homepage/route.ts

import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

// ─── GET /api/admin/homepage ──────────────────────────────────────────────────
// Returns all sections as { section_key: parsed_data, ... }
export async function GET() {
    try {
        const pool = await getDbPool();
        const result = await pool
            .request()
            .query(`SELECT section_key, section_data FROM homepage_content`);

        const sections: Record<string, unknown> = {};
        for (const row of result.recordset) {
            sections[row.section_key] = JSON.parse(row.section_data);
        }

        return NextResponse.json({ success: true, sections });
    } catch (err) {
        console.error("GET all homepage sections error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}