import { NextRequest, NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "ALL";
        const search = searchParams.get("search") || "";
        const dateFrom = searchParams.get("dateFrom") || "";
        const dateTo = searchParams.get("dateTo") || "";
        const amountMin = searchParams.get("amountMin") || "";
        const amountMax = searchParams.get("amountMax") || "";

        const pool = await getDbPool();
        const request = pool.request();

        let where = "WHERE 1=1";
        if (status !== "ALL") { where += " AND payment_status = @status"; request.input("status", sql.NVarChar(50), status); }
        if (search) { where += " AND (donor_name LIKE @search OR donor_email LIKE @search OR donor_phone LIKE @search OR txn_id LIKE @search)"; request.input("search", sql.NVarChar(200), `%${search}%`); }
        if (dateFrom) { where += " AND CAST(created_at AS DATE) >= @dateFrom"; request.input("dateFrom", sql.Date, new Date(dateFrom)); }
        if (dateTo) { where += " AND CAST(created_at AS DATE) <= @dateTo"; request.input("dateTo", sql.Date, new Date(dateTo)); }
        if (amountMin) { where += " AND amount >= @amountMin"; request.input("amountMin", sql.Decimal(18, 2), parseFloat(amountMin)); }
        if (amountMax) { where += " AND amount <= @amountMax"; request.input("amountMax", sql.Decimal(18, 2), parseFloat(amountMax)); }

        const result: any = await request.query(`
      SELECT
        txn_id                   AS [Transaction ID],
        donor_name               AS [Donor Name],
        donor_email              AS [Email],
        donor_phone              AS [Phone],
        donor_pan                AS [PAN],
        amount                   AS [Amount (INR)],
        payment_status           AS [Status],
        payu_payment_id          AS [PayU Payment ID],
        bank_ref_num             AS [Bank Ref No.],
        gateway_response_message AS [Gateway Message],
        created_at               AS [Created At],
        updated_at               AS [Updated At]
      FROM ajf_transaction
      ${where}
      ORDER BY created_at DESC;

      SELECT
        COUNT(*)                                                          AS [Total Records],
        SUM(CASE WHEN payment_status='SUCCESS' THEN 1      ELSE 0   END) AS [Successful],
        SUM(CASE WHEN payment_status='FAILED'  THEN 1      ELSE 0   END) AS [Failed],
        SUM(CASE WHEN payment_status='SUCCESS' THEN amount ELSE 0.0 END) AS [Total Collected (INR)]
      FROM ajf_transaction ${where};
    `);

        const donations = result.recordsets[0] as Record<string, unknown>[];
        const summary = result.recordsets[1][0] as Record<string, unknown>;

        const filterDesc = [
            status !== "ALL" && `Status: ${status}`,
            search && `Search: "${search}"`,
            dateFrom && `From: ${dateFrom}`,
            dateTo && `To: ${dateTo}`,
            amountMin && `Min: ₹${amountMin}`,
            amountMax && `Max: ₹${amountMax}`,
        ].filter(Boolean).join("  |  ") || "All Records";

        // ── Workbook ──────────────────────────────────────────────────────
        const wb = new ExcelJS.Workbook();
        wb.creator = "AkhandJyoti Foundation";
        wb.created = new Date();

        // ── Sheet 1: Donation Report ──────────────────────────────────────
        const ws = wb.addWorksheet("Donation Report", {
            pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1 },
        });

        // Row 1 — Title
        ws.mergeCells("A1:K1");
        const titleCell = ws.getCell("A1");
        titleCell.value = "AkhandJyoti Foundation — Donation Report";
        titleCell.font = { name: "Arial", size: 15, bold: true, color: { argb: "FF2D7A4F" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        ws.getRow(1).height = 30;

        // Row 2 — Filter info + generated date
        ws.mergeCells("A2:K2");
        const infoCell = ws.getCell("A2");
        infoCell.value = `Filters: ${filterDesc}   |   Generated: ${new Date().toLocaleString("en-IN")}`;
        infoCell.font = { name: "Arial", size: 9, italic: true, color: { argb: "FF666666" } };
        infoCell.alignment = { horizontal: "center" };
        ws.getRow(2).height = 16;

        // Row 3 — spacer
        ws.addRow([]);

        // Row 4 — Header
        const headers = [
            "Transaction ID", "Donor Name", "Email", "Phone", "PAN",
            "Amount (INR)", "Status", "PayU Payment ID",
            "Bank Ref No.", "Gateway Message", "Created At", "Updated At",
        ];
        const headerRow = ws.addRow(headers);
        headerRow.height = 22;
        headerRow.eachCell((cell: any) => {
            cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2D7A4F" } };
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            cell.border = { bottom: { style: "thin", color: { argb: "FF81BA45" } } };
        });

        const STATUS_BG: Record<string, string> = { SUCCESS: "FFE8F5ED", FAILED: "FFFDE8E8", INITIATED: "FFE8F0FE", PENDING: "FFFFF3CD", CANCELLED: "FFF5F5F5", HASH_MISMATCH: "FFFFF0E0" };
        const STATUS_FG: Record<string, string> = { SUCCESS: "FF2D7A4F", FAILED: "FFB91C1C", INITIATED: "FF1D4ED8", PENDING: "FF92400E", CANCELLED: "FF374151", HASH_MISMATCH: "FF92400E" };
        const COL_WIDTHS: Record<string, number> = { "Transaction ID": 22, "Donor Name": 22, "Email": 28, "Phone": 14, "PAN": 14, "Amount (INR)": 14, "Status": 16, "PayU Payment ID": 22, "Bank Ref No.": 20, "Gateway Message": 32, "Created At": 18, "Updated At": 18 };

        ws.columns = headers.map(h => ({ key: h, width: COL_WIDTHS[h] || 18 }));

        // Data rows
        donations.forEach((row, i) => {
            const values = headers.map(h => {
                const v = row[h];
                if (h === "Created At" || h === "Updated At") return v ? new Date(v as string) : "";
                if (h === "Amount (INR)") return typeof v === "string" ? parseFloat(v as string) : (v as number);
                return v ?? "—";
            });

            const dataRow = ws.addRow(values);
            dataRow.height = 18;
            const status = row["Status"] as string;

            dataRow.eachCell((cell: any, colNum: any) => {
                const header = headers[colNum - 1];
                cell.font = { name: "Arial", size: 9.5 };
                cell.alignment = { vertical: "middle" };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFAFFF7" : "FFFFFFFF" } };
                cell.border = { bottom: { style: "hair", color: { argb: "FFE8F5E2" } } };

                if (header === "Amount (INR)") {
                    cell.numFmt = '"₹"#,##0.00';
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                    cell.font = { name: "Arial", size: 9.5, bold: true, color: { argb: "FF1a3a10" } };
                }
                if (header === "Status") {
                    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: STATUS_BG[status] || "FFFFFFFF" } };
                    cell.font = { name: "Arial", size: 9, bold: true, color: { argb: STATUS_FG[status] || "FF374151" } };
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                }
                if (header === "Created At" || header === "Updated At") {
                    cell.numFmt = "dd-mmm-yyyy hh:mm";
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                }
            });
        });

        // Freeze header + filter rows, enable auto-filter
        ws.views = [{ state: "frozen", ySplit: 4, xSplit: 0 }];
        ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4, column: headers.length } };

        // ── Sheet 2: Summary ──────────────────────────────────────────────
        const ws2 = wb.addWorksheet("Summary");

        ws2.mergeCells("A1:B1");
        ws2.getCell("A1").value = "Report Summary";
        ws2.getCell("A1").font = { name: "Arial", size: 13, bold: true, color: { argb: "FF2D7A4F" } };
        ws2.getCell("A1").alignment = { horizontal: "center" };
        ws2.getRow(1).height = 28;
        ws2.addRow([]);

        const summaryRows: [string, unknown][] = [
            ["Total Records", summary["Total Records"]],
            ["Successful Payments", summary["Successful"]],
            ["Failed Payments", summary["Failed"]],
            ["Total Collected (INR)", summary["Total Collected (INR)"]],
            ["Filters Applied", filterDesc],
            ["Generated On", new Date().toLocaleString("en-IN")],
        ];

        // Header row for summary table
        const sh = ws2.addRow(["Metric", "Value"]);
        sh.eachCell((cell: any) => {
            cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2D7A4F" } };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });
        sh.height = 20;

        summaryRows.forEach(([label, value], i) => {
            const r = ws2.addRow([label, value]);
            r.height = 20;
            r.getCell(1).font = { name: "Arial", size: 10, bold: true, color: { argb: "FF4a6a30" } };
            r.getCell(2).font = { name: "Arial", size: 10 };
            if (label === "Total Collected (INR)") {
                r.getCell(2).numFmt = '"₹"#,##0.00';
                r.getCell(2).font = { name: "Arial", size: 10, bold: true, color: { argb: "FF2D7A4F" } };
            }
            r.eachCell((cell: any) => {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: i % 2 === 0 ? "FFFAFFF7" : "FFFFFFFF" } };
                cell.border = { bottom: { style: "hair", color: { argb: "FFE0F0D8" } } };
            });
        });

        ws2.columns = [{ width: 28 }, { width: 36 }];

        // ── Output ────────────────────────────────────────────────────────
        const buffer = await wb.xlsx.writeBuffer();
        const filename = `AJF-Donations-${new Date().toISOString().slice(0, 10)}.xlsx`;

        return new NextResponse(Buffer.from(buffer), {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (err) {
        console.error("[admin/export] Error:", err);
        return NextResponse.json({ error: "Export failed." }, { status: 500 });
    }
}