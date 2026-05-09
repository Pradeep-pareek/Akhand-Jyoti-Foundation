import { NextRequest, NextResponse } from "next/server";
import { readGallery, writeGallery, IMAGES_DIR, GalleryItem } from "@/lib/gallery-store";
import fs from "fs";
import path from "path";

type Params = { params: Promise<{ id: string }> };
// ─── GET /api/gallery/:id ────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const items = readGallery();
    const item = items.find((i) => i.id == Number(id));

    if (!item) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...item,
        images: item.images.map((img) => `/api/gallery/image/${img}`),
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// ─── PUT /api/gallery/:id ────────────────────────────────────────────────────
// Body: { title?, description?, images? }
// images = array of filenames (already uploaded). Pass full list to replace.
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const items = readGallery();
    const index = items.findIndex((i) => i.id == Number(id));

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    const body = await req.json() as Partial<GalleryItem>;
    const existing = items[index];

    const updated: GalleryItem = {
      ...existing,
      title: body.title?.trim() ?? existing.title,
      description: body.description?.trim() ?? existing.description,
      images: body.images ?? existing.images,
      updatedAt: new Date().toISOString(),
      eventDate: body.eventDate || existing.eventDate,
    };

    items[index] = updated;
    writeGallery(items);

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// ─── DELETE /api/gallery/:id ─────────────────────────────────────────────────
// Also deletes image files from disk that are NOT referenced by any other item.
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const items = readGallery();
    const index = items.findIndex((i) => i.id == Number(id));

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    const [removed] = items.splice(index, 1);

    // Collect images still in use by other items
    const stillUsed = new Set(items.flatMap((i) => i.images));

    // Delete orphaned image files from disk
    for (const img of removed.images) {
      if (!stillUsed.has(img)) {
        const filePath = path.join(IMAGES_DIR, img);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    writeGallery(items);

    return NextResponse.json({ success: true, message: `Item ${id} deleted` });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}