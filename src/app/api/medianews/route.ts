import { NextResponse } from "next/server";
import { readMediaNews } from "@/lib/medianews-store";

// ─── GET /api/medianews ───────────────────────────────────────────────────────
// Returns all media news items with image URLs.
export async function GET() {
  try {
    const items = readMediaNews();
    const result = items.map((item) => ({
      ...item,
      image: item.image ? `/api/gallery/image/${item.image}` : "",
    }));
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
