// app/api/send-donation-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateReceiptToken } from "@/lib/receipt-token";

export interface DonationEmailPayload {
  toEmail: string;
  toName: string;
  txnid: string;
  amount: string;
  mihpayid: string;
  certificate?: boolean;
}

// ─── Transporter ──────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.FOUNDATION_EMAIL,
    pass: process.env.FOUNDATION_EMAIL_PASS,
  },
});

// ─── Route ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: DonationEmailPayload = await req.json();
    const { toEmail, toName, txnid, amount, mihpayid, certificate = false } = body;

    if (!toEmail || !txnid || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: toEmail, txnid, amount" },
        { status: 400 }
      );
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://akhandjyotifoundation.org").replace(/\/$/, "");
    const token = generateReceiptToken(txnid);
    const receiptUrl = `${appUrl}/receipt/${token}`;

    const subject = certificate
      ? "Your Donation Receipt & 80G Certificate – AkhandJyoti Foundation"
      : "Thank You for Your Generous Donation – AkhandJyoti Foundation";

    await transporter.sendMail({
      from: `"AkhandJyoti Foundation" <${process.env.FOUNDATION_EMAIL}>`,
      to: toEmail,
      subject,
      text: buildPlainText(toName, txnid, amount, mihpayid, certificate, receiptUrl),
      html: buildHtmlEmail(toName, txnid, amount, mihpayid, certificate, receiptUrl),
    });

    return NextResponse.json(
      { success: true, message: "Email sent successfully.", hasCertificate: certificate },
      { status: 200 }
    );

  } catch (err) {
    console.error("[send-donation-email] Error sending email:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}

// ─── Plain-text ───────────────────────────────────────────────────────────────
function buildPlainText(
  name: string,
  txnid: string,
  amount: string,
  mihpayid: string,
  withCert: boolean,
  receiptUrl: string
): string {
  return `
Dear ${name || "Donor"},

Greetings from AkhandJyoti Foundation.

On behalf of the entire AkhandJyoti Foundation family, we sincerely thank you for your generous contribution and support towards our mission.

Your donation is more than a financial contribution — it is a step toward creating meaningful change and empowering lives through our initiatives in women empowerment, education, skill development, and community welfare.

Payment Details:
  Transaction ID : ${txnid}
  Payment Ref    : ${mihpayid}
  Amount         : ₹${amount}

${withCert
    ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 YOUR DONATION RECEIPT & 80G CERTIFICATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Click the link below to view and download your official Donation Receipt
and 80G Certificate. You can print it or save it as a PDF directly from
your browser.

👉 ${receiptUrl}

Steps to save as PDF:
  1. Open the link above in Chrome or Edge
  2. Press Ctrl+P (or Cmd+P on Mac)
  3. Set Destination to "Save as PDF"
  4. Click Save
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    : "Please retain this email for your reference and records."}

Your contribution is eligible for tax benefits under Section 80G of the Income Tax Act (subject to applicable provisions and guidelines).

Thank you once again for being a valuable partner in our journey of creating positive impact.

Warm Regards,
AkhandJyoti Foundation
Creating Change, One Step at a Time

Contact : +91 8800452255
Email   : info@akhandjyotifoundation.org
Website : https://akhandjyotifoundation.org
Office  : C-25, MIQB Centre, Sector 58, Noida, UP – 201301
`.trim();
}

// ─── HTML email ───────────────────────────────────────────────────────────────
function buildHtmlEmail(
  name: string,
  txnid: string,
  amount: string,
  mihpayid: string,
  withCert: boolean,
  receiptUrl: string
): string {

  // Certificate block — only shown when withCert = true
  const certBlock = withCert ? `
          <!-- Certificate CTA -->
          <tr>
            <td style="padding:0 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#F0FBF0;border:1.5px solid #81C784;
                            border-radius:10px;overflow:hidden;">
                <!-- Top strip -->
                <tr>
                  <td style="background:#2E7D32;padding:10px 20px;">
                    <p style="margin:0;color:#fff;font-size:13px;font-weight:bold;letter-spacing:0.5px;">
                      📄 &nbsp;Your Donation Receipt & 80G Certificate is Ready
                    </p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:20px 20px 16px;">
                    <p style="margin:0 0 6px;font-size:13px;color:#333;line-height:1.7;">
                      Click the button below to <strong>view your official receipt</strong>.
                      You can print it or save it as a PDF directly from your browser.
                    </p>
                    <p style="margin:0 0 18px;font-size:12px;color:#777;line-height:1.6;">
                      💡 In Chrome/Edge: <em>Ctrl+P → Destination → Save as PDF → Save</em>
                    </p>
                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius:8px;background:#2E7D32;">
                          <a href="${receiptUrl}"
                             target="_blank"
                             style="display:inline-block;padding:13px 32px;
                                    font-size:14px;font-weight:bold;color:#ffffff;
                                    text-decoration:none;letter-spacing:0.5px;
                                    border-radius:8px;">
                            🖨️ &nbsp;View &amp; Download Receipt
                          </a>
                        </td>
                      </tr>
                    </table>
                    <!-- Fallback link -->
                    <p style="margin:12px 0 0;font-size:11px;color:#999;">
                      Or copy this link:
                      <a href="${receiptUrl}" style="color:#2E7D32;word-break:break-all;">
                        ${receiptUrl}
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Donation Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:8px;overflow:hidden;
                      box-shadow:0 2px 8px rgba(0,0,0,0.08);max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:#1B5E20;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:0.5px;">
                AkhandJyoti Foundation
              </h1>
              <p style="margin:6px 0 0;color:#C8E6C9;font-size:13px;">
                Creating Change, One Step at a Time
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 24px;">
              <p style="margin:0 0 16px;font-size:15px;color:#333;">
                Dear <strong>${name || "Donor"}</strong>,
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.7;">
                Greetings from AkhandJyoti Foundation.
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#333;line-height:1.7;">
                On behalf of the entire AkhandJyoti Foundation family, we sincerely thank you
                for your generous contribution and support towards our mission. Your donation
                is a step toward creating meaningful change in
                <strong>women empowerment, education, skill development,</strong> and
                <strong>community welfare</strong>.
              </p>

              <!-- Success Banner -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#E8F5E9;border:1px solid #A5D6A7;
                            border-radius:6px;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 18px;font-size:15px;font-weight:bold;color:#1B5E20;">
                    ✓ Donation Received Successfully
                  </td>
                </tr>
              </table>

              <!-- Payment details -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#F1F8E9;border-left:4px solid #4CAF50;
                            border-radius:4px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:13px;font-weight:bold;
                               text-transform:uppercase;color:#2E7D32;letter-spacing:0.8px;">
                      Payment Details
                    </p>
                    <table cellpadding="0" cellspacing="0" style="font-size:14px;color:#333;">
                      <tr>
                        <td style="padding:3px 0;width:140px;color:#666;">Transaction ID</td>
                        <td style="padding:3px 0;"><strong>${txnid}</strong></td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;color:#666;">Payment Ref</td>
                        <td style="padding:3px 0;"><strong>${mihpayid}</strong></td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;color:#666;">Amount Donated</td>
                        <td style="padding:3px 0;">
                          <strong style="font-size:16px;color:#2E7D32;">₹${amount}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:15px;color:#333;line-height:1.7;">
                Your contribution is eligible for <strong>tax benefits under Section 80G</strong>
                of the Income Tax Act (subject to applicable provisions and guidelines).
              </p>
              <p style="margin:0 0 4px;font-size:15px;color:#333;">
                Thank you once again for being a valuable partner in our journey.
              </p>
            </td>
          </tr>

          ${certBlock}

          <!-- Signature -->
          <tr>
            <td style="padding:0 40px 36px;">
              <p style="margin:0 0 4px;font-size:15px;color:#333;">Warm Regards,</p>
              <p style="margin:0 0 2px;font-size:15px;font-weight:bold;color:#2E7D32;">
                AkhandJyoti Foundation
              </p>
              <p style="margin:0;font-size:13px;color:#888;font-style:italic;">
                Creating Change, One Step at a Time
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eee;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="font-size:12px;color:#888;line-height:1.8;">
                <tr>
                  <td>📞 +91 8800452255</td>
                  <td align="right">
                    <a href="mailto:info@akhandjyotifoundation.org"
                       style="color:#2E7D32;text-decoration:none;">
                      info@akhandjyotifoundation.org
                    </a>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    🌐 <a href="https://akhandjyotifoundation.org"
                           style="color:#2E7D32;text-decoration:none;">
                      akhandjyotifoundation.org
                    </a>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">📍 C-25, MIQB Centre, Sector 58, Noida, UP – 201301</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}