"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { BsGlobe } from "react-icons/bs";
import { HiOutlineIdentification, HiOutlineMail, HiOutlineMailOpen } from "react-icons/hi";
import { FaRegCalendarAlt, FaRegFileAlt } from "react-icons/fa";
import { PiCertificate } from "react-icons/pi";
import html2pdf from "html2pdf.js";


function amountInWords(amount: number): string {
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
export default function ReceiptPage({
  params,
}: {
  params: { txnid_enc: string };
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [Downloadloading, setDownloadLoading] = useState(false);

  useEffect(() => {
    loadReceipt();
  }, []);

  const loadReceipt = async () => {
    try {
      const res = await fetch(`/api/receipt/${params.txnid_enc}`);
      const json = await res.json();
      console.log("Receipt data:", json);
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <p className="text-[#6B7280] text-lg">Loading Receipt...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <p className="text-[#6B7280] text-lg">Receipt not found</p>
      </div>
    );
  }
  // const sampleData = {
  //   "transaction_id": "1",
  //   "txn_id": "AJF20260524000001",
  //   "donor_name": "Mohit tater",
  //   "donor_email": "mohittater815@gmail.com",
  //   "donor_phone": "8279202499",
  //   "amount": 10,
  //   "payment_gateway": "PAYU",
  //   "product_info": "Donation - AkhandJyoti Foundation",
  //   "payu_payment_id": "28735343653",
  //   "bank_ref_num": "614457491485",
  //   "payment_status": "SUCCESS",
  //   "hash_value": null,
  //   "request_payload": null,
  //   "response_payload": "{\"mihpayid\":\"28735343653\",\"mode\":\"UPI\",\"status\":\"success\",\"unmappedstatus\":\"captured\",\"key\":\"s1y2ZK\",\"txnid\":\"AJF20260524000001\",\"amount\":\"10.00\",\"discount\":\"0.00\",\"net_amount_debit\":\"10\",\"addedon\":\"2026-05-24 15:20:26\",\"productinfo\":\"Donation - AkhandJyoti Foundation\",\"firstname\":\"Mohit\",\"lastname\":\"tater\",\"address1\":\"\",\"address2\":\"\",\"city\":\"JAIPUR\",\"state\":\"\",\"country\":\"India\",\"zipcode\":\"\",\"email\":\"mohittater815@gmail.com\",\"phone\":\"8279202499\",\"udf1\":\"CIRPT8256Q\",\"udf2\":\"JAIPUR\",\"udf3\":\"\",\"udf4\":\"\",\"udf5\":\"\",\"udf6\":\"\",\"udf7\":\"\",\"udf8\":\"\",\"udf9\":\"\",\"udf10\":\"\",\"hash\":\"110ddaa4812124a6cb44775978e09da8869b4a87af7e15fdf952d4884c61a28f899be4decf05343865335a16452a6a3baf762437de44f7bc4239820d299a0cc2\",\"field1\":\"\",\"field2\":\"511940\",\"field3\":\"8279202499@ptaxis\",\"field4\":\"\",\"field5\":\"PPPL287353436532405261520316a12c9e7\",\"field6\":\"MOHIT TATER || UBIN0818038\",\"field7\":\"APPROVED OR COMPLETED SUCCESSFULLY|00\",\"field8\":\"QR\",\"field9\":\"Success|Completed Using Callback\",\"payment_source\":\"payu\",\"meCode\":\"{\\\"pgMerchantId\\\":\\\"INDB000011005501\\\",\\\"encKey\\\":\\\"02be3a84b9fa9a23c49117e463f6ddfd92e19b7d71a1ead6e101417ca54420fd7248fd48195e70d01e6326fa82060919\\\",\\\"merchantVpa\\\":\\\"AKHANDJYOTIFOUNDATION-13606518.payu@indus\\\"}\",\"PG_TYPE\":\"UPI-PG\",\"bank_ref_num\":\"614457491485\",\"bankcode\":\"INTENT\",\"error\":\"E000\",\"error_Message\":\"No Error\"}",
  //   "gateway_response_code": "INTENT",
  //   "gateway_response_message": "No Error",
  //   "success_url": "https://akhandjyotifoundation.org/api/payment/success",
  //   "failure_url": "https://akhandjyotifoundation.org/api/payment/failure",
  //   "remarks": "PayU status: success",
  //   "created_at": "2026-05-24T15:20:25.813Z",
  //   "updated_at": "2026-05-24T15:21:13.930Z",
  //   "donor_pan": "CIRPT8256Q"
  // };
  const {
    txn_id: receiptNo,
    created_at: date,
    donor_pan: pan,
    donor_name: donorName,
    donor_email: email,
    donor_phone: phone,
    donor_city: city,
    payu_payment_id: referenceNo,
    amount,
    remarks
  } = data;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(window.location.href)}`;


  const downloadPDF = async () => {
    setDownloadLoading(true)
    const elements = document.querySelectorAll(".margin-minus");

    elements.forEach((el) => {
      (el as HTMLElement).style.marginTop = "-12px";
    });

    try {
      await html2pdf()
        .set({
          margin: 0,
          filename: "receipt.pdf",
          html2canvas: {
            scale: 3,
            useCORS: true,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        })
        .from(document.getElementById("receipt") as any)
        .save();
    } finally {
      elements.forEach((el) => {
        (el as HTMLElement).style.marginTop = "";
      });
      setDownloadLoading(false)
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex gap-2 print:hidden">

        <button
          onClick={() => downloadPDF()}
          disabled={Downloadloading}
          className="bg-[#15803D] text-[#FFF] px-4 py-2 rounded"
        >
          {Downloadloading ? "Downloading..." : "Download PDF"}
        </button>
        <button
          onClick={() => window.print()}
          className="hidden sm:block bg-[#15803D] text-[#FFF] px-4 py-2 rounded"
        >
          Print Receipt
        </button>

      </div>
      <div className="hidden sm:block">
        <div id="receipt" className="bg-[#F3F4F6] min-h-screen flex justify-center items-start font-sans">
          <div
            className="bg-[#FFF] border-2 border-[#2d6e2d] rounded overflow-hidden relative shadow-2xl"
            style={{ width: "794px", minHeight: "1120px" }}
          >
            {/* ── TOP LEAF DECORATION ── */}
            <div className="absolute top-0 right-0 mr-[-4px] w-36 pointer-events-none z-10">
              <Image
                src="/cert/leaf-branch.png"
                alt=""
                width={140}
                height={200}
                className="object-contain"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
              <Image src="/images/logo-img.svg" alt="" width={500} height={500} />
            </div>

            {/* ══ HEADER ══ */}
            <div className="flex items-center justify-between px-7 pt-5 pb-4 border-b border-[#E5E7EB] relative z-20">
              {/* Logo + org */}
              <div className="flex items-center gap-3.5 w-[315px]">
                <div className="rounded-full overflow-hidden bg-[#FFF] flex items-center justify-center shrink-0">
                  <Image
                    src="/images/logo-img.svg"
                    alt="AJF Logo"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-[9px] text-[#9CA3AF] tracking-widest font-semibold">TM</div>
                  <div className="text-xl font-extrabold text-[#1a5c1a] leading-tight">
                    AkhandJyoti
                    <br />
                    Foundation
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-1 leading-snug">
                    Creating Change,
                    <br />
                    One Step at a Time
                  </div>
                </div>
              </div>

              {/* Vertical divider */}
              <div className="w-px h-20 bg-[#D1D5DB] mx-5 shrink-0" />

              {/* Thank you block */}
              <div className="text-center flex-1">
                <div className="font-serif italic text-2xl text-[#1a5c1a] font-bold">Thank You!</div>
                <div className="my-1.5">
                  <Image
                    src="/cert/heart.png"
                    alt="heart"
                    width={24}
                    height={24}
                    className="inline-block"
                  />
                </div>
                <div className="text-xs text-[#374151] leading-relaxed mt-1">
                  Together, we create hope,
                  <br />
                  empower lives and
                  <br />
                  build a better tomorrow.
                </div>
              </div>
            </div>

            {/* ══ TITLE BAND ══ */}
            <div className="text-center pt-4 pb-1.5 px-4 relative z-20">
              <div className="flex items-center justify-center gap-3">
                <Image src="/cert/leaf-small.png" alt="" width={28} height={22} />
                <h1 className="text-3xl font-black text-[#1a5c1a] margin-minus tracking-widest m-0 uppercase">
                  DONATION RECEIPT
                </h1>
                <Image
                  src="/cert/leaf-small-right.png"
                  alt=""
                  width={28}
                  height={22}
                  className=""
                />
              </div>
              <p className="text-[#6B7280] text-xs mt-1.5 mb-0">
                Your contribution helps us continue our mission.
              </p>
            </div>

            {/* ══ META ROW ══ */}
            <div className="mx-7 my-3">
              <div className="grid grid-cols-3">

                {[
                  {
                    icon: <FaRegFileAlt />,
                    label: "Receipt No.",
                    value: receiptNo,
                  },
                  {
                    icon: <FaRegCalendarAlt />,
                    label: "Date",
                    value: date ? new Date(date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }) : "",
                  },
                  {
                    icon: <HiOutlineIdentification />,
                    label: "PAN (If applicable)",
                    value: pan,
                  },
                  // {
                  //   icon: <PiCertificate />,
                  //   label: "80G Certificate No.",
                  //   value: "AACTA1234JF2023",
                  // },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex text-sm items-center gap-1 px-2  ${i < 2 ? "border-r border-[#D1D5DB]" : ""
                      }`}
                  >
                    {/* Icon Circle */}
                    <div className="w-11 h-11 rounded-full bg-[#EEF6EC] flex items-center justify-center shrink-0">
                      <span className="text-[#1A5C1A] text-lg">
                        {item.icon}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="margin-minus">
                      <div className="text-[10px] font-medium text-[#4B5563]">
                        {item.label}
                      </div>

                      <div className="text-xs  font-semibold text-[#111827] mt-0.5">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══ DONOR INFORMATION ══ */}
            <SectionBlock title="DONOR INFORMATION">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <InfoRow label="Name" value={donorName} />
                <InfoRow label="Email" value={email} />
                <InfoRow label="Phone" value={phone} />
                {/* <InfoRow label="Payment Mode" value={paymentMode || "UPI"} /> */}
                <InfoRow label="City" value={city} />
                <InfoRow label="Transaction ID" value={receiptNo} />
                <InfoRow label="Date of Payment" value={date ? new Date(date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }) : ""} />
              </div>
            </SectionBlock>

            {/* ══ DONATION DETAILS ══ */}
            <SectionBlock title="DONATION DETAILS">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <InfoRow label="Reference No." value={referenceNo || "TXN512345678901"} />
                <div>
                  <InfoRow label="Amount" value={`₹ ${amount || "1,500.00"}`} />
                  <div className="text-[11px] text-[#6B7280] ml-[78px] mt-0.5">
                    ({amountInWords(amount)})
                  </div>
                </div>
                <InfoRow
                  label="Remarks"
                  value={remarks || "Thank you for supporting our cause."}
                  multiline
                />
              </div>
            </SectionBlock>
            <div className="mt-[40px] bg-[#F5F6F1] rounded-xl p-2 mx-2">
              <div className="flex items-center gap-4">
                <Image src="/cert/shield.png" alt="Shield" width={46} height={46} className="shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1A5C1A]">
                    Tax Exemption under Section 80G
                  </h3>

                  <p className="text-sm text-[#374151] mt-1">
                    Donations made to AkhandJyoti Foundation are eligible
                    for tax benefits under Section 80G of the Income Tax Act.
                  </p>

                  <div className="mt-2 inline-flex items-center gap-2 bg-[#f0fdf400] border border-[#BBF7D0] rounded-md px-3 py-1">
                    <PiCertificate className="text-[#1A5C1A] text-lg" />

                    <span className="text-xs text-[#4B5563] margin-minus">
                      80G Certificate No.
                    </span>

                    <span className="font-semibold text-sm text-[#111] margin-minus">
                      AACTA1234JF2023
                    </span>
                  </div>
                </div>

                <img
                  src={qrCodeUrl}
                  alt="Receipt Verification"
                  className="w-25 h-25"
                />

              </div>
            </div>
            {/* ══ CLOSING QUOTE ══ */}
            <div className="text-center px-7 pt-2 pb-1 mt-5 mb-7">
              <div className="flex justify-center gap-2">
                <div className="font-serif italic text-base text-[#1a5c1a] font-bold margin-minus">
                  Your kindness today creates a brighter tomorrow.{" "}
                </div>
                <Image src="/cert/heart.png" alt="♥" width={20} height={14} className="inline-block" />
              </div>
              <div className="flex items-center gap-3 my-1.5">
                <div className="flex-1 h-px bg-[#D1D5DB]" />
                <span className="text-[11px] text-[#9CA3AF] margin-minus">We are grateful for your trust and support.</span>
                <div className="flex-1 h-px bg-[#D1D5DB]" />
              </div>
            </div>

            {/* ══ CONTACT ROW ══ */}
            <div className="flex items-center justify-center bg-[#F5F6F1] border-t border-[#D1D5DB] px-6 py-3">
              <ContactItem
                icon={<FaPhone className="text-[8px] text-[#FFF]" />}
                text="8800452255"
              />

              <ContactItem
                icon={<HiOutlineMail className="text-[8px] text-[#FFF]" />}
                text="info@akhandjyotifoundation.org"
              />
              {/* </div>
          <div className="flex items-center justify-center bg-[#F5F6F1] border-t border-[#D1D5DB] px-6 py-3"> */}

              <ContactItem
                icon={<BsGlobe className="text-[8px] text-[#FFF]" />}
                text="www.akhandjyotifoundation.org"
              />

              <ContactItem
                icon={<FaLocationDot className="text-[8px] text-[#FFF]" />}
                text={`C-25, MIQB Centre,\nNoida Sector 58,\nNoida, UP - 201301`}
              />
            </div>

            {/* ══ FOOTER BAND ══ */}
            <div className="bg-[#1a5c1a] flex items-center justify-between px-7 py-3">
              <div className="flex items-center gap-3.5">
                <Image src="/cert/hands.png" alt="" width={44} height={44} />
                <div className="text-[#cde8cd] text-[11px] leading-relaxed margin-minus">
                  Your small act of kindness today
                  <br />
                  can bring a big change in someone's life tomorrow.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-serif italic margin-minus text-lg text-[#FFF] font-bold flex items-center gap-2">
                  You make a difference.{" "}
                </div>
                <Image src="/cert/white-heart.png" alt="♥" width={30} height={30} className="inline-block" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </>

  );
}

/* ─── Helper components ─── */

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-7 my-[20px]">
      <div className="margin-minus bg-[#1a5c1a] text-[#FFF] text-center font-extrabold text-[12px] tracking-widest py-1.5 px-5 rounded-t-md">
        {title}
      </div>
      <div className="border-[1.5px] border-[#2d6e2d] border-t-0 rounded-b-lg p-3.5 relative overflow-hidden">

        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className={`flex gap-2 ${multiline ? "items-start" : "items-center"}`}>
      <span className="font-bold text-[#1F2937] text-[12px] min-w-[80px] shrink-0">{label}</span>
      <span className="text-[#4B5563] text-[12px]">:</span>
      <span className={`text-[#1F2937] text-[12px] ${multiline ? "whitespace-pre-line" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function ContactItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center px-5 border-l border-[#D1D5DB] first:border-l-0">
      <div className="w-6 h-6 rounded-full bg-[#1A5C1A] flex items-center justify-center shrink-0">
        {icon}
      </div>

      <span className="ml-2 text-[10px] margin-minus text-[#374151] leading-tight whitespace-pre-line">
        {text}
      </span>
    </div>
  );
}