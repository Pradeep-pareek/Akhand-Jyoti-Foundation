import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import * as XLSX from "xlsx";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.max(1, parseInt(searchParams.get("limit") || "20"));
        const offset = (page - 1) * limit;
        const exportAll = searchParams.get("export") === "true";

        const pool = await getDbPool();

        // ─── Excel Export ───────────────────────────────────────────────
        if (exportAll) {
            const result = await pool.request().query(`
                SELECT
                    ContactID,
                    FirstName,
                    LastName,
                    Email,
                    Phone,
                    Message,
                    IsRead,
                    CreatedDate
                FROM ContactUs
                ORDER BY ContactID DESC
            `);

            const exportData = result.recordset.map((item: any) => ({
                "Name": `${item.FirstName} ${item.LastName}`,
                "Email": item.Email,
                "Phone": item.Phone,
                "Message": item.Message,
                "Status": item.IsRead ? "Read" : "Unread",
                "Date": new Date(item.CreatedDate).toISOString().slice(0, 19).replace("T", " "),
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            worksheet["!cols"] = [
                { wch: 25 },
                { wch: 30 },
                { wch: 15 },
                { wch: 50 },
                { wch: 10 },
                { wch: 22 },
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Requests");

            const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
            const filename = `contact-requests-${new Date().toISOString().slice(0, 10)}.xlsx`;

            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": `attachment; filename="${filename}"`,
                },
            });
        }
        // ────────────────────────────────────────────────────────────────

        const countResult = await pool.request().query(`
            SELECT COUNT(*) AS total FROM ContactUs
        `);
        const total = countResult.recordset[0].total;

        const result = await pool.request().query(`
            SELECT
                ContactID, FirstName, LastName,
                Email, Phone, Message, IsRead, CreatedDate
            FROM ContactUs
            ORDER BY ContactID DESC
            OFFSET ${offset} ROWS
            FETCH NEXT ${limit} ROWS ONLY
        `);

        return NextResponse.json({
            success: true,
            data: result.recordset,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to load data" });
    }
}