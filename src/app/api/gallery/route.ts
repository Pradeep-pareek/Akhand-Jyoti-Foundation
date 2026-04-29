import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(req: Request) {
    const { title, description, image_url } = await req.json();

    const pool = await getConnection();

    await pool.request()
        .input("title", title)
        .input("description", description)
        .input("image_url", image_url)
        .query(`
      INSERT INTO Gallery (title, description, image_url)
      VALUES (@title, @description, @image_url)
    `);

    return NextResponse.json({ success: true });
}