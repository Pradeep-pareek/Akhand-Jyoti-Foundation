import crypto from "crypto";

async function verifyPayuTransaction(txnid: string) {
    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;
    const command = "verify_payment";

    const hashString = `${key}|${command}|${txnid}|${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const body = new URLSearchParams({ key, command, var1: txnid, hash } as any);

    const res = await fetch("https://info.payu.in/merchant/postservice?form=2", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    return res.json();
}

export default verifyPayuTransaction;