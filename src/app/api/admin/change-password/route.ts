import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { IMAGES_DIR } from "@/lib/gallery-store";

export async function POST(req: Request) {
  try {
    const {
      currentPassword,
      newPassword,
    } = await req.json();

    const filePath = path.join(
      IMAGES_DIR,
      "data",
      "admin.json"
    );

    const adminData = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    );

    const isMatch = await bcrypt.compare(
      currentPassword,
      adminData.password
    );

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password incorrect",
        },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    adminData.password = hashedPassword;

    fs.writeFileSync(
      filePath,
      JSON.stringify(adminData, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: "Password updated",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}