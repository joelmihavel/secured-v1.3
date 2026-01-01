import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — Flent Secured",
    description: "Privacy Policy explaining how Flent Secured collects, uses, and protects personal information.",
};

export default function SecuredPrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-12">
            <div className="container-large mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 uppercase font-zin">
                        Privacy Policy — Flent Secured
                    </h1>

                    <p className="mb-4"><strong>Last Updated:</strong> 01/01/2026</p>

                    <p className="mb-6">
                        This Privacy Policy explains how <strong>Flent</strong> (“<strong>Flent</strong>”, “<strong>we</strong>”, “<strong>us</strong>”, or “<strong>our</strong>”) collects, uses, discloses, and protects personal information when you use <strong>Flent Secured</strong> (the “<strong>Services</strong>”).
                    </p>

                    <p className="mb-6">
                        By using the Services, you agree to the practices described in this Privacy Policy.
                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">1. Information We Collect</h2>

                    <h3 className="text-xl font-bold mt-6 mb-3 font-zin">1.1 Information You Provide</h3>
                    <p className="mb-2">We may collect information you choose to provide, such as:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Contact information (e.g., phone number, email address)</li>
                        <li>Basic account details and preferences</li>
                        <li>Documents you upload (e.g., rental agreements and related records)</li>
                        <li>Messages you send to support or feedback channels</li>
                    </ul>

                    <h3 className="text-xl font-bold mt-6 mb-3 font-zin">1.2 Information We Collect Automatically</h3>
                    <p className="mb-2">We may automatically collect certain information, including:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Device and app information (device model, OS version, app version)</li>
                        <li>Identifiers and logs (IP address, timestamps, diagnostic logs)</li>
                        <li>Usage activity (feature interactions, performance metrics)</li>
                        <li>Crash logs and diagnostics (if enabled)</li>
                    </ul>

                    <h3 className="text-xl font-bold mt-6 mb-3 font-zin">1.3 Information From Partners (Where Applicable)</h3>
                    <p>
                        If the Services integrate with third-party providers (e.g., payment processors or partners supporting rewards or Protection Cover Plans), we may receive limited information from them as needed to operate the Services and comply with law.
                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">2. How We Use Information</h2>
                    <p className="mb-4">We use personal information to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Provide, operate, and maintain the Services</li>
                        <li>Authenticate users and manage accounts</li>
                        <li>Verify information and reduce fraud or misuse</li>
                        <li>Facilitate payments and related workflows (where available)</li>
                        <li>Provide rewards or benefits for eligible activity (where available)</li>
                        <li>Enable Protection Cover Plans (where available)</li>
                        <li>Improve performance, reliability, and user experience</li>
                        <li>Provide customer support and respond to requests</li>
                        <li>Comply with legal, regulatory, and contractual obligations</li>
                    </ul>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">3. Document Processing</h2>
                    <p className="mb-2">Documents uploaded to the Services may be:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Stored securely</li>
                        <li>Processed using automated and/or manual methods</li>
                        <li>Reviewed for verification, risk checks, fraud prevention, operational support, and compliance</li>
                    </ul>
                    <p className="mt-4">We do not use your documents for advertising.</p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">4. How We Share Information</h2>
                    <p className="mb-4">We do <strong>not</strong> sell your personal information.</p>
                    <p className="mb-4">We may share information with:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li><strong>Service providers</strong> who perform services for us (e.g., hosting, analytics, authentication, customer support tools) under confidentiality and security obligations.</li>
                        <li><strong>Partners</strong> involved in enabling payments, rewards, or <strong>Protection Cover Plans</strong>, to the extent necessary to provide the relevant features.</li>
                        <li><strong>Legal and regulatory authorities</strong> when required by law or to protect rights, safety, and security.</li>
                        <li><strong>Corporate transactions</strong>: If we are involved in a merger, acquisition, financing, reorganization, or sale of assets, information may be transferred as part of that transaction, subject to appropriate protections.</li>
                    </ol>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">5. Retention</h2>
                    <p className="mb-2">We retain personal information for as long as necessary to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>provide the Services</li>
                        <li>comply with legal, accounting, and regulatory requirements</li>
                        <li>resolve disputes and enforce agreements</li>
                    </ul>
                    <p className="mt-4">Retention periods may vary based on the type of information and legal obligations.</p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">6. Security</h2>
                    <p>
                        We implement reasonable technical and organizational safeguards designed to protect personal information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">7. Your Rights and Choices</h2>
                    <p className="mb-2">Subject to applicable law, you may request:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>access to personal information we hold about you</li>
                        <li>correction of inaccurate information</li>
                        <li>deletion of information (where legally and operationally permissible)</li>
                        <li>restriction or objection to certain processing</li>
                    </ul>
                    <p className="mt-4">To make a request, contact us at <strong>support@flent.in</strong>.</p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">8. Children’s Privacy</h2>
                    <p>
                        The Services are not intended for individuals under <strong>18</strong> years of age. We do not knowingly collect personal information from minors.
                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">9. Third-Party Links and Services</h2>
                    <p>
                        The Services may contain links to third-party websites or services. Their privacy practices are governed by their own policies. We are not responsible for third-party privacy practices.
                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">10. International Transfers</h2>
                    <p>
                        Your information may be stored or processed in countries other than where you live, subject to appropriate safeguards as required by applicable law.
                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">11. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will update the “Last Updated” date and post the updated policy on our website. Your continued use of the Services after changes become effective constitutes acceptance of the updated policy.
                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">12. Contact Us</h2>
                    <p className="mb-2"><strong>Flent</strong></p>
                    <p>Email: <strong>support@flent.in</strong></p>
                </div>
            </div>
        </main>
    );
}
