// app/api/admin/update-pan/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export async function POST(req: NextRequest) {
    try {
        const { txnid, pan } = await req.json();

        if (!txnid) {
            return NextResponse.json({ error: "txnid is required" }, { status: 400 });
        }

        // Allow empty string (to clear PAN), but validate format if provided
        const trimmedPan = (pan ?? "").toString().trim().toUpperCase();
        if (trimmedPan && !PAN_REGEX.test(trimmedPan)) {
            return NextResponse.json(
                { error: "Invalid PAN format. Expected format: ABCDE1234F" },
                { status: 422 }
            );
        }

        const pool = await getDbPool();

        // Update donor_pan for the matching transaction
        const result = await pool.request()
            .input("txn_id", sql.NVarChar(100), txnid)
            .input("donor_pan", sql.NVarChar(20), trimmedPan || null)
            .query(`
        UPDATE dbo.ajf_transaction
        SET    donor_pan  = @donor_pan,
               updated_at = GETDATE()
        WHERE  txn_id     = @txn_id
      `);

        if (result.rowsAffected[0] === 0) {
            return NextResponse.json(
                { error: `No transaction found with txn_id: ${txnid}` },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            txnid,
            pan: trimmedPan || null,
            message: trimmedPan
                ? `PAN updated successfully to ${trimmedPan}`
                : "PAN cleared successfully",
        });
    } catch (err) {
        console.error("[admin/update-pan] Error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}