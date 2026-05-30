import { NextRequest, NextResponse } from "next/server";
import { generateReceiptToken } from "@/lib/receipt-token";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { txn_id } = body as any;

        if (!txn_id) {
            return NextResponse.json(
                { success: false, error: "txn_id is required" },
                { status: 400 }
            );
        }

        const enc_txn_id = generateReceiptToken(txn_id);
        return NextResponse.json(enc_txn_id, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}