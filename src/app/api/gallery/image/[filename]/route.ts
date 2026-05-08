import { NextRequest, NextResponse } from "next/server";
import { IMAGES_DIR } from "@/lib/gallery-store";
import fs from "fs";
import path from "path";

type Params = { params: { filename: string } };

// ─── GET /api/gallery/image/:filename ────────────────────────────────────────
// Reads image from D:\Website\Api-Sample-Data\akhandjyoti and streams it back.
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    // Sanitize: prevent directory traversal
    const filename = path.basename(params.filename);
    const filePath = path.join(IMAGES_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }

    const ext = path.extname(filename).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
    };
    const contentType = mimeMap[ext] ?? "application/octet-stream";

    const buffer = fs.readFileSync(filePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}