import crypto from "crypto";

export const PAYU_CONFIG = {
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  KEY: process.env.PAYU_MERCHANT_KEY!,
  SALT: process.env.PAYU_MERCHANT_SALT!,
  BASE_URL: process.env.PAYU_BASE_URL || "https://test.payu.in/_payment",
  // Swap to https://secure.payu.in/_payment in production
};

export interface PayUHashParams {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

/**
 * Generate SHA-512 hash for PayU payment request
 * Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
 */
export function generatePayUHash(params: PayUHashParams, salt: string): string {
  const { key, txnid, amount, productinfo, firstname, email } = params;
  const udf1 = params.udf1 || "";
  const udf2 = params.udf2 || "";
  const udf3 = params.udf3 || "";
  const udf4 = params.udf4 || "";
  const udf5 = params.udf5 || "";

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

  return crypto.createHash("sha512").update(hashString).digest("hex");
}

/**
 * Verify PayU response hash (reverse hash)
 * Formula: sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayUResponseHash(
  responseParams: Record<string, string>,
  salt: string
): boolean {
  const {
    status,
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1 = "",
    udf2 = "",
    udf3 = "",
    udf4 = "",
    udf5 = "",
    hash: receivedHash,
  } = responseParams;

  const hashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

  const computedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  return computedHash === receivedHash;
}