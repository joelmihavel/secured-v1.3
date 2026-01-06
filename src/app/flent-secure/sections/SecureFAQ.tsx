"use client";
import React from "react";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { OpenSection } from "@/components/layout/OpenSection";
import { CardSection } from "@/components/layout/CardSection";

interface SecureFAQProps {
    category: "tenant" | "landlord";
}

// Data can be moved to constants or props, keeping here for simplicity for now
const TENANT_QUESTIONS = [
    { id: 1, question: "Will my landlord even agree to this?", answer: "Most landlords are happy to accept timely payments and security. Flent Secure handles the conversation for you." },
    { id: 2, question: "Is paying rent through Secured... safe?", answer: "Absolutely. We use bank-grade security and partner with regulated payment gateways." },
    { id: 3, question: "Can I really pay rent using my credit card? Isn't that banned?", answer: "Not here. You can use your credit card and earn rewards." },
    { id: 4, question: "Do I get real cashback? Like... actual money?", answer: "Yes, 1% cashback credited directly or as discount on next rent." },
    { id: 5, question: "Is there any catch for tenants?", answer: "No hidden fees. The service fee is transparently shown if applicable." },
];

const LANDLORD_QUESTIONS = [
    { id: 101, question: "Will my landlord even agree to this?", answer: "Wait, you ARE the landlord. Yes, you will agree because it protects your income." },
    { id: 102, question: "Is paying rent through Secured... safe?", answer: "Your tenant pays us, we pay you. Guaranteed on time." },
    { id: 103, question: "What if my tenant doesn't pay?", answer: "That's where our Rent Guarantee comes in. We pay you regardless." },
    { id: 104, question: "Is there any catch for landlords?", answer: "It's free for you for the basic protection plan." },
];

export const SecureFAQ = ({ category }: SecureFAQProps) => {
    const questions = category === "tenant" ? TENANT_QUESTIONS : LANDLORD_QUESTIONS;

    return (
        <CardSection id="faq" className="bg-white py-16">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold mb-4">FAQs</span>
                    <h2 className="text-3xl md:text-4xl font-heading text-black mb-2">
                        Good Renters ask <br /> <span className="font-zin-italic">important questions</span>
                    </h2>
                </div>

                <div className="border border-black rounded-3xl overflow-hidden p-2 md:p-6 bg-white shadow-lg">
                    <h3 className="font-heading text-2xl mb-6 px-2">FAQs.</h3>
                    <FaqAccordion
                        data={questions}
                        className="w-full"
                        questionClassName="bg-gray-50 border-none mb-1 hover:bg-gray-100 transition-colors"
                        answerClassName="bg-white text-gray-700 p-4 border-l-2 border-black"
                        timestamp=""
                    />
                </div>
            </div>
        </CardSection>
    );
};
