"use client";

import React from "react";
import { CardSection } from "@/components/layout/CardSection";
import {
    ImageComparison,
    ImageComparisonImage,
    ImageComparisonSlider
} from "@/components/ui/image-comparison";
import { IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight } from "@tabler/icons-react";

export const FlentMagicSection = () => {
    return (
        <CardSection
            className="bg-forest-green"
            paddingX="none"
            paddingY="none"
            backgroundPattern="/patterns/pie-factory.svg"
            patternMask="to-top"
            patternOpacity={0.05}
        >
            <div className="container mx-auto px-4 pt-20">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-fluid-h2 font-heading text-text-main text-white mb-4">
                        <span className="font-zin-italic">Flent's</span> Magic
                    </h2>
                    <p className="text-subtitle font-body max-w-3xl mx-auto text-white">
                        We beef up your home with curated furniture & interior upgrades without making any structural changes.
                    </p>
                </div>

                {/* Image Comparison */}
                <div className=" mx-auto w-full">
                    <ImageComparison
                        className="aspect-video w-full rounded-3xl overflow-hidden shadow-xl"
                        enableHover
                    >
                        {/* Before Image */}
                        <ImageComparisonImage
                            src="/FlentMagic/before.webp"
                            alt="Before Flent transformation - empty room"
                            position="left"
                        />

                        {/* After Image */}
                        <ImageComparisonImage
                            src="/FlentMagic/after.webp"
                            alt="After Flent transformation - beautifully furnished room"
                            position="right"
                        />

                        {/* Slider */}
                        <ImageComparisonSlider className="w-1 bg-white/50 backdrop-blur-sm">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border-2 border-text-main">
                                    <ChevronLeft className="w-4 h-4 text-text-main -mr-1" />
                                    <ChevronRight className="w-4 h-4 text-text-main -ml-1" />
                                </div>
                            </div>
                        </ImageComparisonSlider>
                    </ImageComparison>

                    {/* Labels */}
                    <div className="flex justify-between mt-6 px-4">
                        <div className="text-left">
                            <p className="text-sm font-medium text-text-main/60">Before</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-text-main/60">After</p>
                        </div>
                    </div>
                </div>
            </div>
        </CardSection>
    );
};
