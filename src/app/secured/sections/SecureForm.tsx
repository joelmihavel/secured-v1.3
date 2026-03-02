"use client";
import React from "react";
import { OpenSection } from "@/components/layout/OpenSection";
import { Button } from "@/components/ui/Button";
import { CTA_IDS } from "@/lib/cta-ids";

export const SecureForm = () => {
    return (
        <OpenSection className="bg-white py-24 md:py-32 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50"></div>

            <div className="max-w-2xl mx-auto px-4 bg-white relative z-10 text-center">
                <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20">
                    <p className="text-brand-orange text-xs font-bold uppercase tracking-widest">
                        120 PEOPLE JOINED THIS WEEK
                    </p>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-medium text-black mb-6 leading-tight">
                    Now let's get your rent to <br /> finally return the favor
                </h2>

                <p className="text-gray-500 text-lg mb-12">No hidden charges. No spam. Just pure value.</p>

                <form className="flex flex-col gap-5 max-w-md mx-auto text-left bg-white p-2 sm:p-0">
                    <div className="group">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-black transition-colors">Rental Address</label>
                        <input type="text" placeholder="e.g. 104, HSR Layout, Sector 4..." className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none font-medium placeholder:text-gray-400" />
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-black transition-colors">Rent Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                            <input type="number" placeholder="Enter amount..." className="w-full p-4 pl-8 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none font-medium placeholder:text-gray-400" />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 group-focus-within:text-black transition-colors">Phone Number</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">+91</span>
                            <input type="tel" placeholder="Enter 10-digit number" className="w-full p-4 pl-12 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all outline-none font-medium placeholder:text-gray-400" />
                        </div>
                    </div>

                    <Button variant="primary" size="lg" className="w-full mt-4 bg-black text-white hover:bg-gray-900 border-none py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all" data-cta-id={CTA_IDS.SECURED_FORM_INVITE} data-cta-context="secured_form">
                        Get Your Invite →
                    </Button>
                    <p className="text-[10px] text-center text-gray-400 uppercase tracking-wider font-medium mt-2">Limited slots available for this month</p>
                </form>
            </div>
        </OpenSection>
    );
};
