import { NextRequest, NextResponse } from "next/server";
import { readFinancials, writeFinancials, FINANCIALS_DIR, FinancialDocument } from "@/lib/financials-store";
import fs from "fs";
import path from "path";

type Params = { params: Promise<{ id: string }> };

// GET /api/admin/financials/:id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const items = readFinancials();
    const item = items.find((i) => i.id === Number(id));
    if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// PUT /api/admin/financials/:id
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const items = readFinancials();
    const index = items.findIndex((i) => i.id === Number(id));
    if (index === -1) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const body = await req.json() as Partial<FinancialDocument>;
    const existing = items[index];

    const updated: FinancialDocument = {
      ...existing,
      tabId: body.tabId ?? existing.tabId,
      year: body.year?.trim() ?? existing.year,
      title: body.title?.trim() ?? existing.title,
      subtitle: body.subtitle?.trim() ?? existing.subtitle,
      filename: body.filename ?? existing.filename,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updated;
    writeFinancials(items);

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// DELETE /api/admin/financials/:id — also removes the PDF file if no other doc references it
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const items = readFinancials();
    const index = items.findIndex((i) => i.id === Number(id));
    if (index === -1) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const [removed] = items.splice(index, 1);

    const stillUsed = new Set(items.map((i) => i.filename));
    if (!stillUsed.has(removed.filename)) {
      const filePath = path.join(FINANCIALS_DIR, removed.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    writeFinancials(items);

    return NextResponse.json({ success: true, message: `Document ${id} deleted` });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
