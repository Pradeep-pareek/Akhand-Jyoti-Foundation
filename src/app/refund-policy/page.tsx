import Link from "next/link";
import { IconHeartFilled } from "@tabler/icons-react";
import Image from "next/image";
import { Check } from "lucide-react";

export default function Home() {
    return (
        <>

        <section className="bg-white lg:py-16 py-10 mt-4">
    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            REFUND POLICY
        </h1>

        <div className="space-y-6 text-gray-700 leading-8">

            <h2 className="text-2xl font-semibold text-gray-900">
                AkhandJyoti Foundation
            </h2>

            <p>
                At AkhandJyoti Foundation, we deeply appreciate the generosity and support of our donors.
                Donations received are utilized towards our charitable, educational, women empowerment,
                skill development, and social welfare initiatives.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900">
                Refund and Cancellation Policy
            </h2>

            <p>
                Any request for cancellation or refund of donations made through our website, payment
                gateway, UPI, bank transfer, or any other online payment mode shall not be entertained
                once the donation has been successfully processed.
            </p>

            <p>
                No cash refund or reversal of donation amount will be permitted after the completion
                of an online donation transaction, as the donated funds are promptly allocated towards
                the Foundation's ongoing charitable programs and activities.
            </p>

            <p>
                We therefore request all donors to carefully verify the following before making a donation:
            </p>

            <ul className="list-disc pl-6 space-y-2">
                <li>Donation amount</li>
                <li>Payment details</li>
                <li>Personal information provided</li>
                <li>Intended purpose of donation</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">
                Failed Transactions
            </h2>

            <p>
                In cases where a payment is debited from the donor's account but the transaction is not
                successfully completed or the donation is not received by AkhandJyoti Foundation, the
                matter shall be governed by the policies and procedures of the respective bank, payment
                gateway, or financial institution involved in processing the transaction.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900">
                Contact Information
            </h2>

            <p>
                AkhandJyoti Foundation
            </p>

            <p>
                C-4B/307-A-GF, Pocket-13, Janakpuri,<br />
                New Delhi – 110058, India
            </p>

            <p>
                Email:&nbsp;info@akhandjyotifoundation.org
            </p>

            <p>
                Phone:&nbsp;+91 8800452255
            </p>

            <p>
                By making a donation to AkhandJyoti Foundation, you acknowledge that you have read,
                understood, and agreed to this Refund Policy.
            </p>

        </div>

    </div>
</section>




        </>
    );
}
