import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = "mysecretkey"; // move to env later

export async function POST(req: Request) {
    const { username, password } = await req.json();

    if (username === "admin" && password === "admin123") {
        const token = jwt.sign({ username }, SECRET, { expiresIn: "1d" });

        const res = NextResponse.json({ success: true });

        res.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
        });

        return res;
    }

    return NextResponse.json({ success: false }, { status: 401 });
}