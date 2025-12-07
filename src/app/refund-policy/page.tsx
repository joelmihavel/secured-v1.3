import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Exchange Policy | Flent",
  description: "Read our Refund & Exchange Policy to understand the terms and conditions regarding token payments, security deposits, and property exchanges.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="container-large mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 uppercase font-zin">
            FLENT.IN REFUND & EXCHANGE POLICY
          </h1>
          
          <p className="mb-6">
            Flent.in, a product offering of Slaash Technologies Private Limited (hereinafter referred to as “<strong>Platform</strong>”, “<strong>We</strong>”, “<strong>Our</strong>” or “<strong>Us</strong>”), we aim to provide our tenants with a transparent and flexible rental experience. Please carefully review our Refund & Exchange Policy to understand the terms and conditions that apply.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">1. Refund Policy</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2 font-zin">1.1 Token Payment</h3>
              <p>
                The token payment made at the time of booking is non-refundable and serves as a binding commitment toward the tenancy. By making this payment, you secure the home and confirm your intent to proceed with the move-in. This policy ensures that the home is exclusively held for you and reinforces mutual commitment between both parties.
              </p>
              <p className="mt-2">
                In case of a cancellation communicated after the agreed move-in date, both the token amount and any rent already paid along with security deposit are subject to deductions, as per the terms shared over email (if the formal agreement is pending). While Flent may, at its discretion and goodwill, choose to waive certain charges, such exceptions must be explicitly confirmed by Flent in writing. This approach helps uphold the integrity and fairness of our booking and onboarding process.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 font-zin">1.2 Early Exit from Lock-In Period</h3>
              <p>
                If a tenant chooses to exit during the lock-in period without serving the required notice (typically one month unless otherwise specified), the full security deposit and rent for the ongoing month will be forfeited. This policy is in place to ensure adherence to agreed terms and to help manage occupancy commitments effectively.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 font-zin">1.3 Exiting without Serving Notice Period</h3>
              <p>
                If a tenant exits the home without serving the required notice period (typically one month unless stated otherwise in the agreement), the entire security deposit will be forfeited. Additionally, any intent to exit will only be considered valid if it is clearly communicated via email to agreements@flent.in and acknowledged by the Flent team. Communication alone does not imply acceptance—confirmation from Flent is required for the notice to be considered active.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 font-zin">1.4 Monthly Rent Payments</h3>
              <p>
                Rent is required to be paid in advance by the 5th of each month. If rent is not paid by this deadline, Flent will impose a non-refundable late payment penalty of INR 2,000. Once rent is paid, it is non-refundable, even if the tenant vacates the property before the end of the month.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 font-zin">1.5 Unforeseen Circumstances</h3>
              <p>
                In the event that we are unable to fulfill specific requests previously agreed upon, such as accommodation in an all-female property or placement with vegetarian-only flatmates, the tenant will be eligible for a full refund of any payments made, provided the request was communicated in writing to a designated representative (or <a href="mailto:agreements@flent.in" className="text-blue-600 hover:underline">agreements@flent.in</a>) prior to the token payment. If the tenant has already moved in, legal fees, move-out charges, and any rental loss due to vacancy will be applicable. This ensures clarity and adherence to the agreed terms.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 font-zin">1.6 Flent Reserve</h3>
              <p>
                For customers opting for Flent Reserve (Reserve), we maintain a clear and transparent refund and adjustment policy. If you elect to move forward with Flent, the booking fee will be applied toward your security deposit, ensuring a seamless transition. Should you choose not to proceed after making a booking, the full booking fee will be refunded within 7 working days, without exception or further inquiry. This policy safeguards both flexibility and clarity, providing reassurance to all Reserve customers.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4 font-zin">2. Exchange Policy</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2 font-zin">2.1 Room or Property Exchanges</h3>
              <p>
                Tenants may request an exchange of rooms or homes, subject to availability and mutual approval. Any exchange may involve rent adjustments based on the pricing of the new home. Standard exit-related charges—such as agreement modification fees and cleaning costs—will apply. A notice period and overlapping rental billing may also be applicable to ensure a smooth transition. All pending dues with Flent and any flatmates must be cleared before the exchange can proceed. Tenants must confirm acceptance of the revised terms in writing before the exchange is finalized.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 font-zin">2.2 Lock-In Implications for Exchanges</h3>
              <p>
                Lock-ins are room-specific. If a tenant exchanges their home before completing the lock-in period, it will be treated as a breach of contract, and the full security deposit may be forfeited—even if the new home is within the Flent network. In exceptional cases, this forfeiture may be waived at Flent’s sole discretion and only through written confirmation from an authorised Flent representative.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p><strong>Grievance Officer:</strong> Rishabh Agnihotri</p>
            <p><strong>Contact:</strong> <a href="mailto:hello@flent.in" className="text-blue-600 hover:underline">hello@flent.in</a></p>
            <p><strong>Corporate Office:</strong> WeWork Pavilion, 62/63 The Pavilion, Church Street, Bangalore, Karnataka 560001</p>
          </div>
        </div>
      </div>
    </main>
  );
}
