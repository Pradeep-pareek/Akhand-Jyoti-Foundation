import fs from "fs";

export function amountInWords(amount: number): string {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
        "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
        "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function convert(n: number): string {
        if (n === 0) return "";
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
        if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
        if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
        if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
        return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
    }

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    let words = convert(rupees) + " Rupees";
    if (paise > 0) words += " and " + convert(paise) + " Paise";
    return words + " Only";
}

export function formatDate(dateStr: string | Date): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit", month: "long", year: "numeric",
    });
}

export function formatINR(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency", currency: "INR", minimumFractionDigits: 2,
    }).format(amount);
}

export function buildCertificateHTML(txn: Record<string, unknown>): string {
    const certNum = `AJF-80G-${(txn.txn_id as string).replace("AJF", "")}`;
    const donorPan = txn.donor_pan as string;
    const amount = txn.amount as number;
    const genDate = new Date().toLocaleString("en-IN");
    const html = `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>80G Certificate - ${certNum}</title>
            <link
                href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"
                rel="stylesheet">
                <script>
                    window.onload = function () {
                        window.print();
                    };
                </script>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                @page {
                    size: A4;
                    margin: 0;
                }
                body {
                font-family: 'Manrope', sans-serif;
                width: 794px;
                min-height: 1123px;
                background: #FAFFF7;
                color: #1a1a1a;
                position: relative;
                margin: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                }

                /* ── Page border decorations ── */
                .border-top    { position: absolute; top: 0;    left: 0; width: 100%; height: 8px;  background: #4a8a2e; }
                .border-top-2  { position: absolute; top: 8px;  left: 0; width: 100%; height: 4px;  background: #81BA45; }
                .border-bottom { position: absolute; bottom: 0; left: 0; width: 100%; height: 8px;  background: #4a8a2e; }
                .border-bottom-2 { position: absolute; bottom: 8px; left: 0; width: 100%; height: 4px; background: #81BA45; }
                .border-left   { position: absolute; top: 0; left: 0;  width: 6px; height: 100%; background: #81BA45; }
                .border-right  { position: absolute; top: 0; right: 0; width: 6px; height: 100%; background: #81BA45; }

                /* ── Outer decorative frame ── */
                .outer-frame {
                position: absolute;
                top: 28px; left: 32px;
                width: calc(100% - 64px);
                height: calc(100% - 56px);
                border: 1.5px solid #81BA45;
                pointer-events: none;
                }
                .inner-frame {
                position: absolute;
                top: 33px; left: 37px;
                width: calc(100% - 74px);
                height: calc(100% - 66px);
                border: 0.5px solid #c8e8b0;
                pointer-events: none;
                }

                /* ── Content wrapper ── */
                .content {
                position: relative;
                padding: 50px 60px 50px 60px;
                z-index: 1;
                }

                /* ── Header ── */
                .org-name {
                font-size: 26px;
                font-weight: 700;
                color: #2D7A4F;
                text-align: center;
                letter-spacing: 0.5px;
                }
                .org-meta {
                text-align: center;
                font-size: 10px;
                color: #666;
                margin-top: 6px;
                line-height: 1.7;
                }

                /* ── Divider ── */
                .divider {
                width: 100%;
                height: 1px;
                background: linear-gradient(to right, transparent, #81BA45, transparent);
                margin: 16px 0;
                }

                /* ── Certificate title ── */
                .cert-title {
                text-align: center;
                font-size: 20px;
                font-weight: 700;
                color: #1a3a10;
                letter-spacing: 2px;
                text-transform: uppercase;
                }
                .cert-subtitle {
                text-align: center;
                font-size: 11px;
                color: #4a8a2e;
                font-weight: 600;
                margin-top: 4px;
                }

                /* ── Receipt meta row ── */
                .meta-row {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                color: #666;
                margin: 18px 0 14px;
                }
                .meta-row span { font-weight: 600; color: #333; }

                /* ── Donor info box ── */
                .info-box {
                background: #EFF8E8;
                border: 0.5px solid #b8dda0;
                border-radius: 10px;
                padding: 18px 22px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px 30px;
                }
                .info-row { display: flex; flex-direction: column; gap: 2px; }
                .info-label { font-size: 9.5px; font-weight: 600; color: #4a6a30; text-transform: uppercase; letter-spacing: 0.5px; }
                .info-value { font-size: 13px; font-weight: 500; color: #1a1a1a; }

                /* ── Amount box ── */
                .amount-box {
                background: linear-gradient(135deg, #2D7A4F, #4a8a2e);
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                margin: 18px 0 8px;
                }
                .amount-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.8); letter-spacing: 1px; text-transform: uppercase; }
                .amount-value {
                font-size: 36px;
                font-weight: 700;
                color: #81BA45;
                margin: 4px 0;
                letter-spacing: -0.5px;
                }
                .amount-words { font-size: 11px; font-style: italic; color: rgba(255,255,255,0.75); }

                /* ── Transaction table ── */
                .section-title {
                font-size: 11px;
                font-weight: 700;
                color: #1a3a10;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin: 20px 0 10px;
                }
                .txn-table { width: 100%; border-collapse: collapse; }
                .txn-table tr:nth-child(even) td { background: #F2FAF0; }
                .txn-table td {
                padding: 7px 12px;
                font-size: 10.5px;
                border-bottom: 0.5px solid #e8f5e2;
                }
                .txn-table td:first-child { color: #4a6a30; font-weight: 600; width: 44%; }
                .txn-table td:last-child  { color: #222; font-family: monospace; font-size: 10px; }

                /* ── Declaration ── */
                .declaration {
                background: #f9fef6;
                border-left: 3px solid #81BA45;
                border-radius: 0 8px 8px 0;
                padding: 12px 16px;
                font-size: 9.5px;
                color: #555;
                line-height: 1.7;
                margin: 18px 0;
                }

                /* ── Signature row ── */
                .sig-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-top: 20px;
                }
                .stamp-box {
                width: 110px;
                height: 70px;
                border: 1.5px dashed #b8dda0;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 9px;
                color: #aaa;
                letter-spacing: 0.5px;
                }
                .sig-block { text-align: right; }
                .sig-org   { font-size: 10px; font-weight: 700; color: #1a3a10; margin-bottom: 32px; }
                .sig-line  { width: 160px; height: 1px; background: #4a8a2e; margin-left: auto; }
                .sig-name  { font-size: 9.5px; color: #555; margin-top: 4px; }

                /* ── Footer ── */
                .footer {
                text-align: center;
                font-size: 8px;
                color: #999;
                margin-top: 18px;
                padding-top: 10px;
                border-top: 0.5px solid #e0f0d8;
                }

                /* ── Watermark ── */
                .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-35deg);
                font-family: 'Playfair Display', serif;
                font-size: 80px;
                font-weight: 700;
                color: rgba(129, 186, 69, 0.05);
                white-space: nowrap;
                pointer-events: none;
                z-index: 0;
                user-select: none;
                }
            </style>
            </head>
            <body>

            <!-- Decorative borders -->
            <div class="border-top"></div>
            <div class="border-top-2"></div>
            <div class="border-bottom"></div>
            <div class="border-bottom-2"></div>
            <div class="border-left"></div>
            <div class="border-right"></div>
            <div class="outer-frame"></div>
            <div class="inner-frame"></div>

            <!-- Subtle watermark -->
            <div class="watermark">AkhandJyoti</div>

            <div class="content">

                <!-- ── Header ── -->
                <h1 class="org-name">AkhandJyoti Foundation</h1>
                <p class="org-meta">
                Reg. No: XXXXXXXXX &nbsp;|&nbsp; 80G Reg. No: XXXXXXXXXXXXXXXXXX<br/>
                123, Foundation Street, Jaipur, Rajasthan - 302001 &nbsp;|&nbsp; support@akhandjyoti.org
                </p>

                <div class="divider"></div>

                <!-- ── Title ── -->
                <h2 class="cert-title">Donation Receipt</h2>
                <p class="cert-subtitle">Under Section 80G of the Income Tax Act, 1961</p>

                <!-- ── Meta ── -->
                <div class="meta-row">
                <div>Receipt No: <span>${certNum}</span></div>
                <div>Date: <span>${formatDate(txn.created_at as string)}</span></div>
                </div>

                <!-- ── Donor Info ── -->
                <div class="info-box">
                <div class="info-row">
                    <span class="info-label">Donor Name</span>
                    <span class="info-value">${txn.donor_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email Address</span>
                    <span class="info-value">${txn.donor_email || "—"}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone Number</span>
                    <span class="info-value">${txn.donor_phone || "—"}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">PAN Number</span>
                    <span class="info-value">${donorPan}</span>
                </div>
                </div>

                <!-- ── Amount ── -->
                <div class="amount-box">
                <div class="amount-label">Donation Amount</div>
                <div class="amount-value">${formatINR(amount)}</div>
                <div class="amount-words">${amountInWords(amount)}</div>
                </div>

                <!-- ── Transaction Details ── -->
                <div class="section-title">Transaction Details</div>
                <table class="txn-table">
                <tr><td>Transaction ID</td><td>${txn.txn_id}</td></tr>
                <tr><td>PayU Payment ID</td><td>${txn.payu_payment_id || "—"}</td></tr>
                <tr><td>Bank Reference No.</td><td>${txn.bank_ref_num || "—"}</td></tr>
                <tr><td>Payment Mode</td><td>Online (PayU)</td></tr>
                <tr><td>Payment Status</td><td>SUCCESS ✓</td></tr>
                <tr><td>Payment Date</td><td>${formatDate(txn.updated_at as string)}</td></tr>
                </table>

                <!-- ── Declaration ── -->
                <div class="declaration">
                This is to certify that the above-mentioned donor has made a voluntary donation to AkhandJyoti Foundation,
                a registered charitable trust, and this receipt is issued as acknowledgement thereof. The donation qualifies
                for <strong>50% deduction under Section 80G</strong> of the Income Tax Act, 1961. This is a computer-generated
                receipt and does not require a physical signature. Please retain this receipt for your Income Tax records.
                </div>

                <!-- ── Signature ── -->
                <div class="sig-row">
                <div class="stamp-box">Official Stamp</div>
                <div class="sig-block">
                    <div class="sig-org">For AkhandJyoti Foundation</div>
                    <div class="sig-line"></div>
                    <div class="sig-name">Authorised Signatory</div>
                </div>
                </div>

                <!-- ── Footer ── -->
                <div class="footer">
                Generated on ${genDate} &nbsp;|&nbsp; ${certNum} &nbsp;|&nbsp;
                This receipt is valid for Income Tax purposes under Section 80G of the Income Tax Act, 1961.
                </div>

            </div>
            </body>
            </html>`;
    // fs.writeFileSync("debug-certificate.html", html);

    return html;
}