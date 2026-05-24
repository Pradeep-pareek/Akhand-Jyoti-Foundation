import { NextRequest, NextResponse } from "next/server";
import { readGallery, writeGallery, nextId, GalleryItem } from "@/lib/gallery-store";

// ─── GET /api/gallery ────────────────────────────────────────────────────────
// Returns all gallery items. Each image is returned as a URL path.
export async function GET() {
  try {
    const items = readGallery();
    // Map image filenames → public URLs  e.g. /api/gallery/image/photo.jpg
    const result = items.map((item) => ({
      ...item,
      images: item.images.map((img) => `/api/gallery/image/${img}`),
    }));
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
