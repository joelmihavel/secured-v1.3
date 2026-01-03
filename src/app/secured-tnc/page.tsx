import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms and Conditions — Flent Secured",
    description: "Terms and Conditions governing your access to and use of the Flent Secured mobile application and related services.",
};

export default function SecuredTnCPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-12">
            <div className="container-large mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 uppercase font-zin">
                        Terms and Conditions — Flent Secured
                    </h1>

                    <p className="mb-4"><strong>Last Updated:</strong> 01/01/2026</p>

                    <p className="mb-6">
                        These Terms and Conditions (“<strong>Terms</strong>”) govern your access to and use of the <strong>Flent Secured</strong> mobile application, website, and related services (collectively, the “<strong>Services</strong>”), operated by <strong>Flent</strong> (“<strong>Flent</strong>”, “<strong>we</strong>”, “<strong>us</strong>”, or “<strong>our</strong>”).
                    </p>

                    <p className="mb-6">
                        By downloading, accessing, or using the Services, you agree to be bound by these Terms. If you do not agree, do not use the Services.
                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">1. Eligibility</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>You must be at least <strong>18 years</strong> old to use the Services.</li>
                        <li>You represent and warrant that you have the legal capacity to enter into these Terms and that any information you provide is accurate, complete, and lawful.</li>
                    </ol>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">2. The Services</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>
                            Flent Secured is a technology platform for tenants and landlords. Features may include (without limitation):
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>User onboarding and account creation</li>
                                <li>Document submission and verification workflows</li>
                                <li>Rent payment workflows</li>
                                <li>Rewards and benefits related to eligible activity (including percentage-based rewards)</li>
                                <li><strong>Protection Cover Plans</strong> designed to reduce certain rental-related risks</li>
                                <li>Notifications, dashboards, and other premium experiences</li>
                            </ul>
                        </li>
                        <li>The Services may change over time. We may add, modify, suspend, or discontinue any part of the Services at any time.</li>
                        <li>Availability of features may vary by user eligibility, geography, risk checks, partner availability, and other criteria determined by Flent.</li>
                    </ol>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">3. Account Registration and Security</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>You may be required to register an account (for example, using a phone number and OTP or other credentials).</li>
                        <li>You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account.</li>
                        <li>You must promptly notify us if you suspect unauthorized access to your account.</li>
                    </ol>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">4. User Content and Document Submission</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>The Services may allow you to upload documents and other information (“<strong>User Content</strong>”), including rental agreements or related records.</li>
                        <li>
                            You represent and warrant that:
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>You own or have the legal right to submit the User Content</li>
                                <li>Your User Content is accurate and not deceptive</li>
                                <li>Your submission does not violate law or any third-party rights</li>
                            </ul>
                        </li>
                        <li>We may process User Content for purposes including verification, risk checks, fraud prevention, customer support, compliance, and service improvement.</li>
                        <li>We do not guarantee the legal validity, enforceability, or completeness of any User Content submitted through the Services.</li>
                    </ol>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">5. Payments</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Certain features may enable or facilitate rent payments and related workflows.</li>
                        <li>Where payments are enabled, payment processing may be carried out by third-party providers and will be subject to their terms, policies, and applicable laws.</li>
                        <li>Flent does not act as a bank, lender, or regulated financial institution unless expressly stated in writing.</li>
                    </ol>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">6. Rewards and Benefits (Including “Up to 1%”)</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>The Services may provide rewards or benefits (including percentage-based rewards) for <strong>eligible</strong> users or transactions.</li>
                        <li>
                            Rewards are <strong>not guaranteed</strong> for all users or transactions and may be subject to:
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>eligibility checks</li>
                                <li>limits, caps, or exclusions</li>
                                <li>partner rules</li>
                                <li>compliance requirements</li>
                                <li>these Terms and any additional reward terms we publish</li>
                            </ul>
                        </li>
                        <li>If the Services reference “<strong>up to 1%</strong>” rewards, that phrase means the reward rate may vary and can be lower than 1% depending on eligibility, rules, and conditions.</li>
                    </ol>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">7. Protection Cover Plans</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>The Services may offer or enable access to <strong>Protection Cover Plans</strong> designed to reduce certain rental-related risks for eligible users.</li>
                        <li>
                            Protection Cover Plans:
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>are subject to eligibility and plan-specific terms</li>
                                <li>do <strong>not</strong> constitute a promise or guarantee against loss</li>
                                <li>may be supported, administered, or funded by third-party partners</li>
                            </ul>
                        </li>
                        <li>Any protection outcome is subject to verification, plan rules, exclusions, and limits.</li>
                    </ol>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">8. Prohibited Conduct</h2>
                    <p className="mb-4">You agree not to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>submit forged, unauthorized, or misleading documents</li>
                        <li>use the Services for unlawful, fraudulent, or abusive purposes</li>
                        <li>attempt to bypass security, verification, or access controls</li>
                        <li>interfere with or disrupt the Services, servers, or networks</li>
                        <li>reverse engineer or exploit the Services except to the extent permitted by law</li>
                    </ul>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">9. Intellectual Property</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>The Services and all related intellectual property rights (including software, trademarks, designs, and content) are owned by Flent or its licensors.</li>
                        <li>We grant you a limited, non-exclusive, non-transferable, revocable license to use the Services for their intended purpose, subject to these Terms.</li>
                    </ol>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">10. Disclaimers</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>The Services are provided on an <strong>“as is”</strong> and <strong>“as available”</strong> basis.</li>
                        <li>To the maximum extent permitted by law, we disclaim all warranties, express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</li>
                        <li>We do not guarantee uninterrupted, error-free, or secure operation of the Services.</li>
                        <li>Flent does not provide legal, financial, tax, or professional advice.</li>
                    </ol>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">11. Limitation of Liability</h2>
                    <p className="mb-4">To the fullest extent permitted by law:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Flent will not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, revenue, data, or goodwill.</li>
                        <li>Flent’s total liability for all claims in any 12-month period will not exceed the amount you paid to Flent (if any) in that period.</li>
                    </ol>
                    <p className="mt-4">Some jurisdictions do not allow certain limitations; in such cases, these limitations apply to the maximum extent permitted by law.</p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">12. Indemnification</h2>
                    <p className="mb-4">
                        You agree to indemnify and hold harmless Flent, its affiliates, officers, directors, employees, and partners from any claims, damages, liabilities, losses, and expenses (including reasonable legal fees) arising out of or related to:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>your use of the Services</li>
                        <li>your User Content</li>
                        <li>your violation of these Terms or applicable law</li>
                    </ul>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">13. Termination</h2>
                    <p>
                        We may suspend or terminate your access to the Services at any time if we reasonably believe you have violated these Terms or if required for security, compliance, or operational reasons.
                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">14. Changes to These Terms</h2>
                    <p>
                        We may update these Terms from time to time. The “Last Updated” date indicates when changes were made. Your continued use of the Services after changes become effective constitutes acceptance of the updated Terms.
                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">15. Governing Law and Dispute Resolution</h2>
                    <p>
                        These Terms are governed by the laws of <strong>India</strong>. Courts located in <strong>[INSERT CITY, INDIA]</strong> will have jurisdiction, subject to applicable law.
                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">16. Contact</h2>
                    <p className="mb-2"><strong>Flent</strong></p>
                    <p>Email: <strong>support@flent.in</strong></p>
                </div>
            </div>
        </main>
    );
}
