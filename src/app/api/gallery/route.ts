import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(req: Request) {
    const { title, description, image_url } = await req.json();

    return NextResponse.json({ success: true });
}