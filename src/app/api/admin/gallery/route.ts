import { NextRequest, NextResponse } from "next/server";
import { readGallery, writeGallery, nextId, GalleryItem } from "@/lib/gallery-store";

// ─── POST /api/admin/gallery ───────────────────────────────────────────────────────
// Body: { title: string, description: string, images?: string[] }
// images should be filenames already uploaded via /api/admin/gallery/upload
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, images = [], eventDate } = body as Partial<GalleryItem>;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "title and description are required" },
        { status: 400 }
      );
    }

    const items = readGallery();
    const now = new Date().toISOString();

    const newItem: GalleryItem = {
      id: nextId(items),
      title: title.trim(),
      description: description.trim(),
      images: images as string[],
      eventDate: eventDate || null,
      createdAt: now,
      updatedAt: now,
    };

    items.push(newItem);
    writeGallery(items);

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}