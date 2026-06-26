import Link from "next/link";
import { IconHeartFilled } from "@tabler/icons-react";
import Image from "next/image";
import { Check } from "lucide-react";

export default function Home() {
    return (
        <>

           <section className="bg-white lg:py-16 py-10 mt-4">
    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                WEBSITE TERMS OF USE
            </h1>

            <p className="text-lg font-semibold text-gray-800 mb-1">
                AkhandJyoti Foundation
            </p>

            <p className="text-gray-600 mb-8">
                Effective Date: 1 April 2026
            </p>

            <div className="space-y-5 text-gray-700 leading-8">

                <p>
                    Welcome to the website of AkhandJyoti Foundation ("Foundation", "we", "our", or "us").
                </p>

                <p>
                    These Terms of Use govern your access to and use of our website, services, content, donation facilities, and related resources. By accessing or using our website, you agree to be bound by these Terms of Use and our Privacy Policy.
                </p>

                <p>
                    If you do not agree with any part of these Terms, please discontinue use of the website immediately.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">
                    1. Introduction
                </h2>

                <h3 className="text-xl font-semibold">
                    1.1 Acceptance of Terms
                </h3>

                <p>
                    By accessing, browsing, or using this website, you acknowledge that you have read, understood, and agreed to these Terms of Use.
                </p>

                <h3 className="text-xl font-semibold">
                    1.2 Changes to Terms
                </h3>

                <p>
                    AkhandJyoti Foundation reserves the right to modify, update, or replace these Terms at any time without prior notice. Updated versions will be posted on this page and become effective immediately upon publication.
                </p>

                <p>
                    Your continued use of the website constitutes acceptance of any modifications.
                </p>

                <h3 className="text-xl font-semibold">
                    1.3 Privacy Policy
                </h3>

                <p>
                    Any personal information submitted through this website shall be governed by our Privacy Policy.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">
                    2. Intellectual Property Rights
                </h2>

                <h3 className="text-xl font-semibold">
                    2.1 Ownership
                </h3>

                <p>
                    All content on this website, including but not limited to:
                </p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>Text</li>
                    <li>Images</li>
                    <li>Graphics</li>
                    <li>Logos</li>
                    <li>Videos</li>
                    <li>Documents</li>
                    <li>Publications</li>
                    <li>Website Design</li>
                </ul>

                <p>
                    is the property of AkhandJyoti Foundation unless otherwise stated and is protected by applicable intellectual property laws.
                </p>

                <h3 className="text-xl font-semibold">
                    2.2 Permitted Use
                </h3>

                <p>You may:</p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>View website content for personal and non-commercial purposes.</li>
                    <li>Download or print materials for informational use.</li>
                    <li>Share publicly available content with proper attribution.</li>
                </ul>

                <h3 className="text-xl font-semibold">
                    2.3 Restricted Use
                </h3>

                <p>You may not:</p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>Reproduce website content for commercial purposes.</li>
                    <li>Modify or republish website material without written permission.</li>
                    <li>Use Foundation trademarks or logos without authorization.</li>
                    <li>Distribute copyrighted materials unlawfully.</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">
                    3. Website Information Disclaimer
                </h2>

                <p>
                    The information provided on this website is for general informational purposes only.
                </p>

                <p>
                    While AkhandJyoti Foundation strives to keep information accurate and updated, we make no representations or warranties regarding:
                </p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>Accuracy</li>
                    <li>Completeness</li>
                    <li>Reliability</li>
                    <li>Suitability</li>
                    <li>Availability</li>
                </ul>

                <p>
                    Any reliance placed on website information is strictly at your own risk.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">
                    4. User Conduct
                </h2>

                <p>When using this website, you agree not to:</p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>Violate any applicable law or regulation.</li>
                    <li>Upload malicious software, viruses, or harmful code.</li>
                    <li>Attempt unauthorized access to any part of the website.</li>
                    <li>Interfere with website functionality or security.</li>
                    <li>Submit false, misleading, or fraudulent information.</li>
                    <li>Post offensive, defamatory, abusive, or unlawful content.</li>
                </ul>

                <p>
                    AkhandJyoti Foundation reserves the right to remove content or restrict access for violations of these Terms.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">
                    5. Donations
                </h2>

                <h3 className="text-xl font-semibold">5.1 Donation Processing</h3>
                <p>All donations made through our website are processed through secure payment gateways.</p>

                <h3 className="text-xl font-semibold">5.2 Donation Acknowledgement</h3>
                <p>Donation receipts will be issued as per applicable regulations and Foundation policies.</p>

                <h3 className="text-xl font-semibold">5.3 Donor Responsibility</h3>

                <p>Donors are responsible for ensuring:</p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>Accuracy of donation details</li>
                    <li>Correct payment information</li>
                    <li>Intended donation amount before submission</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">
                    6. Cancellation and Refund Policy
                </h2>

                <p>
                    AkhandJyoti Foundation utilizes donated funds for charitable and social welfare activities.
                </p>

                <p>As a general policy:</p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>Donations once successfully processed are considered final.</li>
                    <li>Refund requests will only be considered in exceptional circumstances such as duplicate transactions or technical payment errors.</li>
                    <li>Any approved refund shall be processed through the original payment method.</li>
                </ul>

                <p>
                    Refund requests must be submitted within 7 days of the transaction along with relevant payment details.
                </p>

                <p>
                    The Foundation reserves the right to approve or reject refund requests at its sole discretion.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">7. Third-Party Links</h2>

                <p>This website may contain links to external websites for user convenience.</p>

                <p>AkhandJyoti Foundation:</p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>Does not control third-party websites.</li>
                    <li>Is not responsible for their content.</li>
                    <li>Does not guarantee the accuracy of information on external sites.</li>
                    <li>Does not endorse products, services, or opinions displayed on such websites.</li>
                </ul>

                <p>Users access third-party websites at their own risk.</p>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">8. Website Availability</h2>

                <p>We strive to maintain uninterrupted website access; however, we do not guarantee:</p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>Continuous availability</li>
                    <li>Error-free operation</li>
                    <li>Freedom from technical interruptions</li>
                </ul>

                <p>The website may be temporarily unavailable due to:</p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>Maintenance</li>
                    <li>System upgrades</li>
                    <li>Technical failures</li>
                    <li>Circumstances beyond our control</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">9. Limitation of Liability</h2>

                <p>To the fullest extent permitted by law, AkhandJyoti Foundation shall not be liable for:</p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>Direct or indirect damages</li>
                    <li>Loss of data</li>
                    <li>Business interruption</li>
                    <li>Financial loss</li>
                    <li>Loss arising from website use or inability to use the website</li>
                </ul>

                <p>Nothing in these Terms excludes liability where such exclusion is prohibited by applicable law.</p>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">10. Security</h2>

                <p>We employ reasonable security measures to protect website users and transactions.</p>

                <p>However, internet communications cannot be guaranteed as completely secure.</p>

                <p>Users are responsible for maintaining the security of their own devices, passwords, and internet connections.</p>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">11. User Accounts (If Applicable)</h2>

                <p>Where user registration is available:</p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>Users must provide accurate information.</li>
                    <li>Login credentials must remain confidential.</li>
                    <li>Users are responsible for all activities under their account.</li>
                </ul>

                <p>AkhandJyoti Foundation may suspend or terminate accounts involved in misuse, fraud, or violation of these Terms.</p>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">12. Indemnification</h2>

                <p>
                    You agree to indemnify and hold harmless AkhandJyoti Foundation, its trustees, officers, employees, volunteers, and affiliates from any claims, damages, losses, liabilities, or expenses arising from:
                </p>

                <ul className="list-disc pl-8 space-y-2">
                    <li>Violation of these Terms</li>
                    <li>Misuse of the website</li>
                    <li>Violation of applicable laws</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">13. Governing Law and Jurisdiction</h2>

                <p>
                    These Terms of Use shall be governed and interpreted in accordance with the laws of India.
                </p>

                <p>
                    Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 pt-6">14. Contact Information</h2>

                <p>For questions regarding these Terms of Use, please contact:</p>

                <p><strong>AkhandJyoti Foundation</strong></p>

                

                <p>
                    Email:
                    info@akhandjyotifoundation.org
                </p>

                <p>
                    Phone:
                    +91 8800452255
                </p>

                <p>
                    We welcome your questions, suggestions, and feedback regarding the use of our website.
                </p>

                <p className="pt-6 font-semibold">
                    © AkhandJyoti Foundation. All Rights Reserved.
                </p>

            </div>
        </div>

        </div>
   

</section>




        </>
    );
}
