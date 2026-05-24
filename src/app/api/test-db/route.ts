import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDbPool();

    const result = await db.request().query(`
      SELECT TOP 1 * FROM ajf_transaction
    `);

    return NextResponse.json({
      success: true,
      data: result.recordset,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}