import { NextRequest, NextResponse } from "next/server";
import { IMAGES_DIR } from "@/lib/gallery-store";
import fs from "fs";
import path from "path";

// ─── POST /api/admin/gallery/upload ────────────────────────────────────────────────
// Accepts multipart/form-data with one or more files under the key "images"
// Returns the saved filenames to be stored in the gallery item.
export async function POST(req: NextRequest) {
  try {
    // Ensure upload directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided under key 'images'" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const savedFilenames: string[] = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `File type ${file.type} not allowed` },
          { status: 400 }
        );
      }

      // Generate unique filename: timestamp + original name
      const ext = path.extname(file.name) || ".jpg";
      const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
      const filename = `${Date.now()}_${baseName}${ext}`;
      const dest = path.join(IMAGES_DIR, filename);

      // Write file to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      savedFilenames.push(filename);
    }

    return NextResponse.json({
      success: true,
      filenames: savedFilenames,
      // Convenience: ready-to-use API URLs
      urls: savedFilenames.map((f) => `/api/gallery/image/${f}`),
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}