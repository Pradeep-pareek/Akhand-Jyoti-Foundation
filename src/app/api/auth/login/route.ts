import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { IMAGES_DIR } from "@/lib/gallery-store";

const SECRET = "CAggAqZk8lShEohVivw7JlXj/nZSOCak8XSh5rrKLEw=";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        const filePath = path.join(IMAGES_DIR, "data", "admin.json");

        if (!fs.existsSync(filePath)) {

            // Create data directory if not exists
            const dataDir = path.join(IMAGES_DIR, "data");

            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            // Default admin credentials
            const defaultAdmin = {
                username: "admin",
                password: await bcrypt.hash("admin123", 10),
            };

            // Create admin.json
            fs.writeFileSync(
                filePath,
                JSON.stringify(defaultAdmin, null, 2)
            );
        }

        const adminData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        const isValidUser = username === adminData.username;
        console.log("Admin data loaded:", adminData);
        const isValidPassword = await bcrypt.compare(
            password,
            adminData.password
        );

        if (!isValidUser || !isValidPassword) {
            return NextResponse.json(
                { success: false },
                { status: 401 }
            );
        }

        const token = jwt.sign({ username }, SECRET, {
            expiresIn: "1d",
        });

        const res = NextResponse.json({
            success: true,
        });

        res.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
        });

        return res;

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}