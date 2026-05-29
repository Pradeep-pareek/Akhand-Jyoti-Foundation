// lib/receipt-token.ts
// Signs and verifies receipt tokens using HMAC-SHA256.
// The token is a URL-safe base64 string: base64url(txnid + "." + hmac)
//
// ENV required:
//   RECEIPT_SECRET=any_long_random_string   (min 32 chars recommended)
//   e.g. openssl rand -hex 32

import crypto from "crypto";

function getSecret(): string {
  const secret = process.env.RECEIPT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("RECEIPT_SECRET env var is missing or too short (min 16 chars)");
  }
  return secret;
}

/** Convert a string to URL-safe base64 */
function toBase64Url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Decode URL-safe base64 back to string */
function fromBase64Url(str: string): string {
  // Restore padding
  const padded = str + "=".repeat((4 - (str.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

/** Generate HMAC-SHA256 of the payload using the secret */
function sign(payload: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate a signed token for a txnid.
 * Token format (URL-safe base64): base64url("<txnid>.<hmac>")
 *
 * Example:
 *   generateReceiptToken("AJF2025-000123")
 *   → "QUpGMjAyNS0wMDAxMjMuYWJjZGVm..."
 */
export function generateReceiptToken(txnid: string): string {
  const hmac = sign(txnid);
  const payload = `${txnid}.${hmac}`;
  return toBase64Url(payload);
}

/**
 * Verify a token and extract the txnid.
 * Returns the txnid string if valid, null if tampered/invalid.
 *
 * Example:
 *   verifyReceiptToken("QUpGMjAyNS0wMDAxMjMuYWJjZGVm...")
 *   → "AJF2025-000123"  or  null
 */
export function verifyReceiptToken(token: string): string | null {
  try {
    const decoded = fromBase64Url(token);
    const dotIndex = decoded.lastIndexOf(".");

    if (dotIndex === -1) return null;

    const txnid = decoded.slice(0, dotIndex);
    const providedHmac = decoded.slice(dotIndex + 1);
    const expectedHmac = sign(txnid);

    // Constant-time comparison to prevent timing attacks
    const provided = Buffer.from(providedHmac, "hex");
    const expected = Buffer.from(expectedHmac, "hex");

    if (provided.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(provided, expected)) return null;

    return txnid;
  } catch {
    return null;
  }
}