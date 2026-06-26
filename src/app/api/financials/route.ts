import { NextResponse } from "next/server";
import { readFinancials } from "@/lib/financials-store";

// GET /api/financials — public, returns all documents
export async function GET() {
  try {
    const items = readFinancials();
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
