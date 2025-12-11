"use client";

import React from "react";
import { CardSection } from "@/components/layout/CardSection";
import { GetStartedForm } from "@/components/ui/GetStartedForm";

export const ContactSection = () => {
    return (
        <CardSection className="bg-bg-white" id="contact" backgroundPattern="/patterns/groovy.svg" patternMask="to-bottom" patternOpacity={0.04}>
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-fluid-h2 font-heading text-text-main mb-6">
                            Let's Get <span className="font-zin-italic">Started</span>
                        </h2>
                        <p className="text-subtitle font-body text-text-main/70 max-w-2xl mx-auto">
                            Fill out the form below and our team will reach out to guide you through Flent-ing your home.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                        <GetStartedForm />
                    </div>
                </div>
            </div>
        </CardSection>
    );
};
