import { NextRequest, NextResponse } from "next/server";
import { FINANCIALS_DIR } from "@/lib/financials-store";
import fs from "fs";
import path from "path";

type Params = { params: Promise<{ filename: string }> };

// GET /api/financials/pdf/[filename] — serve a PDF file
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { filename } = await params;

    // Prevent directory traversal
    const safe = path.basename(filename);
    const filePath = path.join(FINANCIALS_DIR, safe);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: "File not found" }, { status: 404 });
    }

    const buffer = fs.readFileSync(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${safe}"`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
