// app/receipt/[token]/page.tsx

import { notFound } from "next/navigation";
import { verifyReceiptToken } from "@/lib/receipt-token";

interface Props {
  params: { txnid_enc: string };
}

export default function ReceiptPage({ params }: Props) {
  const { txnid_enc } = params;

  const txnid = verifyReceiptToken(txnid_enc);
  if (!txnid) return notFound();

  return (
    <iframe src={`/api/receipt/${txnid_enc}`} title="Donation Receipt"  className="w-full h-screen"/>
  );
}