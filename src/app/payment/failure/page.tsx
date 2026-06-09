import Link from "next/link";

interface SearchParams {
  txnid?: string;
  reason?: string;
}

export default function PaymentFailurePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { txnid, reason } = searchParams;

  const friendlyReason =
    reason === "hash_mismatch"
      ? "Payment verification failed. Please contact support."
      : reason === "server_error"
      ? "A server error occurred. Please try again."
      : reason === "invalid_request"
      ? "Invalid payment request."
      : reason
      ? decodeURIComponent(reason)
      : "Your payment could not be completed.";

  return (
    <div className=" my-5 bg-[#F4F9F1] flex items-center justify-center px-4">
      <div className="bg-white rounded-[24px] shadow-xl max-w-md w-full p-8 text-center">
        {/* Failure icon */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Not Completed
        </h1>
        <p className="text-gray-600 text-sm mb-6">{friendlyReason}</p>

        {txnid && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-medium text-gray-700 font-mono text-xs">
                {txnid}
              </span>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mb-6">
          No amount has been deducted. Please try again or contact{" "}
          <a href="mailto:support@akhandjyoti.org" className="text-[#7BBE4A] hover:underline">
            support@akhandjyoti.org
          </a>{" "}
          if the issue persists.
        </p>

        <Link
          href="/donation"
          className="inline-block w-full py-3 rounded-2xl font-bold text-white text-sm bg-gradient-to-br from-[#7BBE4A] to-[#5a9e2f] shadow-md hover:shadow-lg transition-all"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
