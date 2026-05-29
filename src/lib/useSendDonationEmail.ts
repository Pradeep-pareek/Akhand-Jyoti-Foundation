// hooks/useSendDonationEmail.ts
import { useState, useCallback } from "react";

export interface DonationEmailPayload {
  toEmail: string;
  toName: string;
  txnid: string;
  amount: string;
  mihpayid: string;
}

export type EmailStatus = "idle" | "sending" | "sent" | "error";

export interface UseSendDonationEmailReturn {
  /** Current status of the email send operation */
  status: EmailStatus;
  /** Error message, populated only when status === "error" */
  error: string | null;
  /** Trigger the email send; resolves true on success, false on failure */
  sendEmail: (payload: DonationEmailPayload) => Promise<boolean>;
  /** Reset status back to "idle" */
  reset: () => void;
}

/**
 * useSendDonationEmail
 *
 * Custom hook that calls /api/send-donation-email and tracks the request state.
 *
 * Usage (e.g. on the payment success page):
 *
 *   const { sendEmail, status, error } = useSendDonationEmail();
 *
 *   useEffect(() => {
 *     if (txnid && amount && mihpayid && donorEmail) {
 *       sendEmail({
 *         toEmail:  donorEmail,
 *         toName:   donorName,
 *         txnid,
 *         amount,
 *         mihpayid,
 *       });
 *     }
 *   }, [txnid]);
 */
export function useSendDonationEmail(): UseSendDonationEmailReturn {
  const [status, setStatus] = useState<EmailStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const sendEmail = useCallback(async (payload: DonationEmailPayload): Promise<boolean> => {
    // Guard: don't fire if already in-flight or already sent
    if (status === "sending" || status === "sent") return false;

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/send-donation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Request failed with status ${res.status}`);
      }

      setStatus("sent");
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error occurred.";
      console.error("[useSendDonationEmail] Failed to send email:", message);
      setError(message);
      setStatus("error");
      return false;
    }
  }, [status]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, sendEmail, reset };
}