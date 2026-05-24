import Link from "next/link";
import Image from "next/image";

interface SearchParams {
  txnid?: string;
  amount?: string;
  mihpayid?: string;
}

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { txnid, amount, mihpayid } = searchParams;

  return (
    <div className="my-5 bg-[#F4F9F1] flex items-center justify-center px-4">
      <div className="bg-white rounded-[24px] shadow-xl max-w-md w-full p-8 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-[#E8F5ED] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-[#2D7A4F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[#1a3a10] mb-2">
          Donation Successful!
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Thank you for your generous contribution to AkhandJyoti Foundation.
          Your support helps us create lasting impact.
        </p>

        {/* Transaction details */}
        {(txnid || amount || mihpayid) && (
          <div className="bg-[#F4F9F1] rounded-xl p-4 mb-6 text-left space-y-2">
            {amount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount Donated</span>
                <span className="font-semibold text-[#1a3a10]">
                  ₹{parseFloat(amount).toLocaleString("en-IN")}
                </span>
              </div>
            )}
            {txnid && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-medium text-gray-700 font-mono text-xs">
                  {txnid}
                </span>
              </div>
            )}
            {mihpayid && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">PayU Reference</span>
                <span className="font-medium text-gray-700 font-mono text-xs">
                  {mihpayid}
                </span>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-[#7a9e6a] mb-6">
          An 80G tax receipt will be sent to your email within 3-5 working days.
        </p>

        <Link
          href="/"
          className="inline-block w-full py-3 rounded-2xl font-bold text-white text-sm bg-gradient-to-br from-[#7BBE4A] to-[#5a9e2f] shadow-md hover:shadow-lg transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}