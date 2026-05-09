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

// ─── PUT /api/impact-numbers ──────────────────────────────────────────────────
// Body: { stats: StatItem[] }  — replaces the entire list.
// Or:   { id: number, value: number, label: string } — updates a single item.
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Bulk update: full array passed
    if (Array.isArray(body.stats)) {
      const incoming = body.stats as StatItem[];

      if (incoming.some((s) => typeof s.id !== "number" || typeof s.value !== "number" || !s.label)) {
        return NextResponse.json(
          { success: false, error: "Each stat must have id (number), value (number), and label (string)" },
          { status: 400 }
        );
      }

      writeStats(incoming);
      return NextResponse.json({ success: true, data: incoming });
    }

    // Single item update: { id, value?, label? }
    if (typeof body.id === "number") {
      const current = readStats();
      const index = current.findIndex((s) => s.id === body.id);

      if (index === -1) {
        return NextResponse.json({ success: false, error: "Stat not found" }, { status: 404 });
      }

      if (body.value !== undefined && typeof body.value !== "number") {
        return NextResponse.json({ success: false, error: "value must be a number" }, { status: 400 });
      }

      current[index] = {
        ...current[index],
        ...(body.value  !== undefined && { value: body.value }),
        ...(body.label  !== undefined && { label: String(body.label).trim().toUpperCase() }),
      };

      writeStats(current);
      return NextResponse.json({ success: true, data: current[index] });
    }

    return NextResponse.json(
      { success: false, error: "Provide either { stats: StatItem[] } for bulk update or { id, value?, label? } for single update" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}