"use client";
import React from "react";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { OpenSection } from "@/components/layout/OpenSection";

interface SecureFAQProps {
    category: "tenant" | "landlord";
}

// Data can be moved to constants or props, keeping here for simplicity for now
const TENANT_QUESTIONS = [
    { id: 1, question: "Will my landlord even agree to this?", answer: "Most do, because it gives them something too: a free rental insurance cover of up to ₹1.5 lakh. You just send an invite link; we guide them through the rest." },
    { id: 2, question: "Is paying rent through Secured… safe?", answer: "Yes. Boringly yes. Payments move through RBI-regulated rails. Everything works exactly as it should, just with rewards attached." },
    { id: 3, question: "Can I really pay rent using my credit card? Isn't that banned?", answer: "On most platforms, yes. But Secured processes rent the right way, fully compliant, no disguises, no loopholes. So yes, your card works here. And earns 1% back." },
    { id: 4, question: "Do I get real cashback? Like… actual money?", answer: "You earn 1% back inside Secured. It isn't withdrawable, but it does reduce your next month's rent. Your rent finally helps pay rent :)" },
    { id: 5, question: "What if my landlord doesn't respond to the invite?", answer: "We nudge them gently. If needed, we nudge again. If really needed, we show you how to nudge them. It's teamwork." },
    { id: 6, question: "Is there any catch for tenants?", answer: "No fees, no lock-ins, no strange clauses. Just pay rent on time & earn 1% back. Your landlord gets their insurance; you get your reward." },
    { id: 7, question: "What happens to my data?", answer: "Nothing scandalous. No selling, no sharing, no trading. Only used to run your account and keep payments secure." },
    { id: 8, question: "Why do I need to pay rent for 3 months before the insurance activates?", answer: "Insurance needs a minimum activity window to stay valid. Three months of rent flow = active coverage. (You don't pay for this. It's still free for your landlord.)" },
    { id: 9, question: "What if I change houses later?", answer: "Easy. Update your address → invite your next landlord → continue earning. Your good habits move with you." },
];

const LANDLORD_QUESTIONS = [
    { id: 101, question: "Do I have to pay anything for this cover?", answer: "No. The cover is completely free for landlords. There are no charges, renewals, or hidden fees." },
    { id: 102, question: "How does my cover activate?", answer: "Once your tenant pays three consecutive months of rent through Secured, your cover becomes active automatically." },
    { id: 103, question: "What exactly does the cover protect me from?", answer: "Two situations:\nIf your tenant moves out after serving notice and your home stays vacant for 30 days, you get up to one month's rent.\nIf your tenant leaves without notice, you get up to one month's rent after the security deposit is adjusted." },
    { id: 104, question: "What is the maximum amount I can receive?", answer: "You're covered for up to ₹1.5 lakh of rental income." },
    { id: 105, question: "How fast is the payout?", answer: "Instant. Once eligibility is met, payouts are processed immediately—no paperwork or follow-ups." },
    { id: 106, question: "What does signing Flent as a property management company mean?", answer: "It's a simple onboarding agreement that allows us to administer the protection stack. You retain full control of your property—rent, tenants, decisions. Nothing operational changes for you." },
    { id: 107, question: "Will my tenant know they are being insured?", answer: "Your tenant sees Secured as a rent payment product with benefits for them. They don't see insurance documents or claims—they simply pay rent through the app." },
    { id: 108, question: "What if my tenant doesn't want to switch to Secured?", answer: "Most tenants prefer Secured because they get 1% cashback and access to a better renting profile. But if they initially hesitate, you can invite them again—they lose nothing by switching." },
    { id: 109, question: "What if my property rarely stays vacant?", answer: "Great—that means you may never need to claim. But when stakes are high, having a protection layer is better than relying on luck, especially with a property worth crores." },
    { id: 110, question: "Does Secured intervene in my tenant relationships?", answer: "No. You manage your property exactly as you do today. Secured only handles:\nrent collection\nyour protection layer\npayouts when triggered" },
    { id: 111, question: "What happens to the insurance if I change tenants?", answer: "Your cover continues. Once the new tenant completes 3 consecutive Secured payments, the protection automatically resets and stays active." },
    { id: 112, question: "Does this cover damages or unpaid rent?", answer: "Not yet. Those protections are part of the broader protection stack we're building—coming soon as additional layers." },
    { id: 113, question: "Can I still collect rent in my bank account?", answer: "Yes. Secured simply facilitates the payment and protection. Funds ultimately settle to your account as usual." },
    { id: 114, question: "Is my property data safe?", answer: "Yes. We only use the information required to activate and process payouts. No data is sold or shared externally." },
    { id: 115, question: "Do I need to file paperwork to claim?", answer: "No paperwork. Once the conditions are met (vacancy for 30 days or an abrupt exit), your payout is processed automatically." },
];

export const SecureFAQ = ({ category }: SecureFAQProps) => {
    const questions = category === "tenant" ? TENANT_QUESTIONS : LANDLORD_QUESTIONS;

    return (
        <OpenSection id="faq" className="relative bg-white py-16">
            {/* Dark background for bottom half */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#121212]" />

            <div className="max-w-3xl mx-auto px-4 md:px-8 relative z-10">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold mb-4">FAQs</span>
                    <h2 className="text-fluid-h2 font-heading text-black mb-2">
                        You got questions? <br /> <span className="font-zin-italic">We got answers</span>
                    </h2>
                </div>

                <div className="border border-black rounded-3xl overflow-hidden p-2 md:p-6 bg-white shadow-lg">
                    <h3 className="font-heading text-fluid-h3 mb-6 px-2">FAQs.</h3>
                    <FaqAccordion
                        data={questions}
                        className="w-full"
                        questionClassName="bg-gray-50 border-none mb-1 hover:bg-gray-100 transition-colors"
                        answerClassName="bg-white text-gray-700 p-4 border-l-2 border-black"
                        timestamp=""
                    />
                </div>
            </div>
        </OpenSection>
    );
};
