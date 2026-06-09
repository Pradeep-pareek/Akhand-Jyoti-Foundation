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
            PRIVACY POLICY
        </h1>

        <p className="text-gray-600 mb-2">
            <strong>AkhandJyoti Foundation</strong>
        </p>

        <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> 1 April 2026
        </p>

        <p className="text-gray-700 leading-8 mb-8">
            AkhandJyoti Foundation ("Foundation", "we", "our", or "us") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard your personal information when you visit our website, interact with us, make donations, participate in our programs, or communicate with us.
        </p>

        <p className="text-gray-700 leading-8 mb-8">
            By using our website and services, you agree to the collection and use of information in accordance with this Privacy Policy.
        </p>

        <div className="space-y-10">

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    1. Information We Collect
                </h2>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                    Personal Information
                </h3>

                <p className="text-gray-700 mb-4">
                    We may collect personal information that you voluntarily provide, including:
                </p>

                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                    <li>Full Name</li>
                    <li>Email Address</li>
                    <li>Phone Number</li>
                    <li>Postal Address</li>
                    <li>Donation Information</li>
                    <li>Payment Details (processed securely through third-party payment gateways)</li>
                    <li>Information submitted through contact forms, event registrations, volunteer applications, or surveys</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                    Non-Personal Information
                </h3>

                <p className="text-gray-700 mb-4">
                    We may automatically collect certain information about your visit, including:
                </p>

                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                    <li>IP Address</li>
                    <li>Browser Type</li>
                    <li>Device Information</li>
                    <li>Pages Visited</li>
                    <li>Date and Time of Access</li>
                    <li>Website Usage Statistics</li>
                </ul>

                <p className="text-gray-700">
                    This information helps us improve our website and services.
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    2. Why We Collect Information
                </h2>

                <p className="text-gray-700 mb-4">
                    We collect information to:
                </p>

                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Process donations and issue receipts</li>
                    <li>Respond to inquiries and support requests</li>
                    <li>Manage volunteer and beneficiary programs</li>
                    <li>Provide updates regarding our activities and initiatives</li>
                    <li>Improve website performance and user experience</li>
                    <li>Comply with legal and regulatory obligations</li>
                    <li>Maintain organizational records</li>
                </ul>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    3. How We Use Your Information
                </h2>

                <p className="text-gray-700 mb-4">
                    Your information may be used to:
                </p>

                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                    <li>Process and acknowledge donations</li>
                    <li>Send donation receipts and confirmations</li>
                    <li>Communicate important updates about our projects and campaigns</li>
                    <li>Respond to your requests and inquiries</li>
                    <li>Improve our services and website functionality</li>
                    <li>Conduct internal analysis and reporting</li>
                    <li>Meet legal, financial, and compliance requirements</li>
                </ul>

                <p className="text-gray-700">
                    Where you have provided consent, we may also send newsletters, event updates, fundraising appeals, and information about our activities.
                    You may opt out of promotional communications at any time.
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    4. Protection and Security of Information
                </h2>

                <p className="text-gray-700 mb-4">
                    AkhandJyoti Foundation takes appropriate technical and organizational measures to protect your personal information against:
                </p>

                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                    <li>Unauthorized access</li>
                    <li>Loss or theft</li>
                    <li>Alteration</li>
                    <li>Disclosure</li>
                    <li>Destruction</li>
                </ul>

                <p className="text-gray-700 mb-4">
                    All online transactions are processed through secure payment gateways using industry-standard encryption technologies.
                </p>

                <p className="text-gray-700">
                    While we strive to protect your information, no method of electronic transmission or storage is completely secure. Therefore, we cannot guarantee absolute security.
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    5. Sharing of Information
                </h2>

                <p className="text-gray-700 mb-4">
                    We do not sell, rent, or trade personal information to third parties.
                </p>

                <p className="text-gray-700 mb-4">
                    Information may be shared only in the following circumstances:
                </p>

                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>With authorized service providers assisting us in operations</li>
                    <li>With payment processing partners for donation transactions</li>
                    <li>When required by law, regulation, court order, or government authority</li>
                    <li>To protect the rights, property, or safety of AkhandJyoti Foundation or others</li>
                </ul>

                <p className="text-gray-700 mt-4">
                    All third-party partners are expected to maintain the confidentiality and security of your information.
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    6. Accessing and Updating Your Information
                </h2>

                <p className="text-gray-700 mb-4">
                    You have the right to:
                </p>

                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                    <li>Request access to your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Update your contact details</li>
                    <li>Withdraw consent for communications</li>
                    <li>Request deletion of information where legally permissible</li>
                </ul>

                <p className="text-gray-700">
                    To exercise these rights, please contact us using the details provided below.
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    7. Cookies Policy
                </h2>

                <p className="text-gray-700 mb-4">
                    Our website may use cookies and similar technologies to enhance user experience.
                </p>

                <p className="text-gray-700 mb-4">
                    Cookies help us:
                </p>

                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                    <li>Understand website usage patterns</li>
                    <li>Improve website functionality</li>
                    <li>Remember user preferences</li>
                    <li>Analyze website performance</li>
                </ul>

                <p className="text-gray-700">
                    Most web browsers automatically accept cookies. You may modify your browser settings to decline cookies if preferred. However, certain website features may not function properly if cookies are disabled.
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    8. Third-Party Links
                </h2>

                <p className="text-gray-700">
                    Our website may contain links to external websites. AkhandJyoti Foundation is not responsible for the privacy practices, content, or policies of third-party websites.
                </p>

                <p className="text-gray-700 mt-4">
                    We encourage users to review the privacy policies of any external websites they visit.
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    9. Data Retention
                </h2>

                <p className="text-gray-700 mb-4">
                    We retain personal information only for as long as necessary to:
                </p>

                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Fulfill the purposes outlined in this policy</li>
                    <li>Meet legal and regulatory obligations</li>
                    <li>Maintain financial and donation records</li>
                    <li>Resolve disputes and enforce agreements</li>
                </ul>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    10. Changes to This Privacy Policy
                </h2>

                <p className="text-gray-700">
                    AkhandJyoti Foundation reserves the right to modify this Privacy Policy at any time.
                </p>

                <p className="text-gray-700 mt-4">
                    Any updates will be posted on this page with a revised effective date. Continued use of our website after changes are published constitutes acceptance of those changes.
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    11. Contact Us
                </h2>

                <p className="text-gray-700 mb-4">
                    For any questions, concerns, or requests regarding this Privacy Policy, please contact:
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <p className="font-semibold text-gray-900 mb-3">
                        AkhandJyoti Foundation
                    </p>

                    <p className="text-gray-700 mb-2">
                        <strong>Address:</strong>
                    </p>

                    <p className="text-gray-700 mb-4">
                        C-4B/307-A-GF, Pocket-13, Janakpuri,<br />
                        New Delhi – 110058, India
                    </p>

                    <p className="text-gray-700 mb-2">
                        <strong>Email:</strong>
                    </p>

                    <p className="text-gray-700 mb-4">
                        akhandjyotifoundation@gmail.com
                    </p>

                    <p className="text-gray-700 mb-2">
                        <strong>Phone:</strong>
                    </p>

                    <p className="text-gray-700">
                        +91 8800452255
                    </p>
                </div>

                <p className="text-gray-700 mt-6">
                    We welcome your comments, questions, and feedback regarding privacy and data protection.
                </p>
            </div>

        </div>
    </div>
</section>


         

        </>
    );
}
