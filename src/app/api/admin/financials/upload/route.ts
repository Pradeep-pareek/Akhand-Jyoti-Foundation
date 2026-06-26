import { NextRequest, NextResponse } from "next/server";
import { FINANCIALS_DIR } from "@/lib/financials-store";
import fs from "fs";
import path from "path";

// POST /api/admin/financials/upload — accepts a single PDF under key "pdf"
export async function POST(req: NextRequest) {
  try {
    if (!fs.existsSync(FINANCIALS_DIR)) {
      fs.mkdirSync(FINANCIALS_DIR, { recursive: true });
    }

    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided under key 'pdf'" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    const ext = ".pdf";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${Date.now()}_${baseName}${ext}`;
    const dest = path.join(FINANCIALS_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(dest, buffer);

    return NextResponse.json({
      success: true,
      filename,
      url: `/api/financials/pdf/${filename}`,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
