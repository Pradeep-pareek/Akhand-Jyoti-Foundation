import { NextRequest, NextResponse } from "next/server";
import { readMediaNews, writeMediaNews, nextId, MediaNewsItem } from "@/lib/medianews-store";

// ─── POST /api/admin/medianews ────────────────────────────────────────────────
// Body: { title, description, image, link }
// image should be a filename already uploaded via /api/admin/gallery/upload
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, image = "", link = "" } = body as Partial<MediaNewsItem>;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { success: false, error: "title and description are required" },
        { status: 400 }
      );
    }

    const items = readMediaNews();
    const now = new Date().toISOString();

    const newItem: MediaNewsItem = {
      id: nextId(items),
      title: title.trim(),
      description: description.trim(),
      image: image as string,
      link: (link as string).trim(),
      createdAt: now,
      updatedAt: now,
    };

    items.push(newItem);
    writeMediaNews(items);

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
