import { NextRequest, NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";
import { generatePayUHash, PAYU_CONFIG } from "@/lib/payu";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, pan, city, amount } = body;

    // --- Validate required fields ---
    if (!name || !phone || !email || !amount) {
      return NextResponse.json(
        { success: false, error: "name, phone, email, and amount are required." },
        { status: 400 }
      );
    }

    const parsedAmount = parseFloat(amount);
    // if (isNaN(parsedAmount) || parsedAmount < 100) {
    //   return NextResponse.json(
    //     { success: false, error: "Minimum donation amount is ₹100." },
    //     { status: 400 }
    //   );
    // }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${appUrl}/api/payment/success`;
    const failureUrl = `${appUrl}/api/payment/failure`;

    // --- Call sp_createOrder to create transaction record ---
    const pool = await getDbPool();
    const result = await pool
      .request()
      .input("donor_name", sql.NVarChar(200), name)
      .input("donor_email", sql.NVarChar(200), email)
      .input("donor_phone", sql.NVarChar(20), phone)
      .input("donor_pan", sql.NVarChar(20), pan ? pan.toUpperCase() : null)
      .input("amount", sql.Decimal(18, 2), parsedAmount)
      .input("product_info", sql.NVarChar(255), "Donation - AkhandJyoti Foundation")
      .input("success_url", sql.NVarChar(500), successUrl)
      .input("failure_url", sql.NVarChar(500), failureUrl)
      .execute("sp_createOrder");

    const transaction = result.recordset[0];
    const txnId: string = transaction.txn_id;

    // --- Generate PayU Hash ---
    const firstname = name.split(" ")[0];
    const amountStr = parsedAmount.toFixed(2);

    // Store PAN in udf1 for reference (optional)
    const udf1 = pan ? pan.toUpperCase() : "";
    const udf2 = city || "";

    const hash = generatePayUHash(
      {
        key: PAYU_CONFIG.KEY,
        txnid: txnId,
        amount: amountStr,
        productinfo: "Donation - AkhandJyoti Foundation",
        firstname,
        email,
        udf1,
        udf2,
      },
      PAYU_CONFIG.SALT
    );

    // --- Update transaction with hash ---
    await pool
      .request()
      .input("txn_id", sql.NVarChar(100), txnId)
      .input("payment_status", sql.NVarChar(50), "INITIATED")
      .input("remarks", sql.NVarChar(sql.MAX), "Hash generated, redirecting to PayU")
      .execute("sp_updateOrder");

    return NextResponse.json({
      success: true,
      payuParams: {
        key: PAYU_CONFIG.KEY,
        txnid: txnId,
        amount: amountStr,
        productinfo: "Donation - AkhandJyoti Foundation",
        firstname,
        lastname: name.split(" ").slice(1).join(" ") || "",
        email,
        phone,
        surl: successUrl,
        furl: failureUrl,
        hash,
        udf1,
        udf2,
        city,
        country: "India",
      },
      payuUrl: PAYU_CONFIG.BASE_URL,
    });
  } catch (error) {
    console.error("[create-order] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initiate payment. Please try again." },
      { status: 500 }
    );
  }
}