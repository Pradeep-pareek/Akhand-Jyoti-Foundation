import { NextRequest, NextResponse } from "next/server";
import { readMediaNews, writeMediaNews, MediaNewsItem } from "@/lib/medianews-store";
import fs from "fs";
import path from "path";
import { IMAGES_DIR } from "@/lib/gallery-store";

type Params = { params: Promise<{ id: string }> };

// ─── PUT /api/admin/medianews/:id ─────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const items = readMediaNews();
    const index = items.findIndex((i) => i.id === Number(id));

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    const body = (await req.json()) as Partial<MediaNewsItem>;
    const existing = items[index];

    const updated: MediaNewsItem = {
      ...existing,
      title: body.title?.trim() ?? existing.title,
      description: body.description?.trim() ?? existing.description,
      image: body.image !== undefined ? (body.image as string) : existing.image,
      link: body.link?.trim() ?? existing.link,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updated;
    writeMediaNews(items);

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// ─── DELETE /api/admin/medianews/:id ──────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const items = readMediaNews();
    const index = items.findIndex((i) => i.id === Number(id));

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    const [removed] = items.splice(index, 1);

    // Delete image file if no other item references it
    if (removed.image) {
      const stillUsed = items.some((i) => i.image === removed.image);
      if (!stillUsed) {
        const filePath = path.join(IMAGES_DIR, removed.image);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }

    writeMediaNews(items);

    return NextResponse.json({ success: true, message: `Item ${id} deleted` });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
