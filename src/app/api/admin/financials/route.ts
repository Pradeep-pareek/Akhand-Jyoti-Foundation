import { NextRequest, NextResponse } from "next/server";
import { readFinancials, writeFinancials, nextId, FinancialDocument, FinancialTabId } from "@/lib/financials-store";

// GET /api/admin/financials
export async function GET() {
  try {
    const items = readFinancials();
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// POST /api/admin/financials
// Body: { tabId, year, title, subtitle, filename }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<FinancialDocument>;
    const { tabId, year, title, subtitle, filename } = body;

    if (!tabId || !year || !title || !filename) {
      return NextResponse.json(
        { success: false, error: "tabId, year, title, and filename are required" },
        { status: 400 }
      );
    }

    const validTabs: FinancialTabId[] = ["policies", "fundraising", "financials"];
    if (!validTabs.includes(tabId)) {
      return NextResponse.json({ success: false, error: "Invalid tabId" }, { status: 400 });
    }

    const items = readFinancials();
    const now = new Date().toISOString();

    const newItem: FinancialDocument = {
      id: nextId(items),
      tabId,
      year: year.trim(),
      title: title.trim(),
      subtitle: (subtitle || "").trim(),
      filename,
      createdAt: now,
      updatedAt: now,
    };

    items.push(newItem);
    writeFinancials(items);

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
