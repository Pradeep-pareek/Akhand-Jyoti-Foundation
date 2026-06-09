import { readStats, StatItem, writeStats } from "@/lib/impact-numbers-store";
import { NextRequest, NextResponse } from "next/server";

// ─── GET /api/impact-numbers ──────────────────────────────────────────────────
// Returns the full list of impact stats.
export async function GET() {
  try {
    const data = readStats();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}