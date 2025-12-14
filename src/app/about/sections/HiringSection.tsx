import React from "react";
import { CardSection } from "@/components/layout/CardSection";
import { Button } from "@/components/ui/Button";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";

export const HiringSection = () => {
    return (
        <CardSection className="bg-forest-green" paddingX="large" paddingY="large" backgroundPattern="/patterns/morphing-diamonds.svg" patternMask="to-top" patternOpacity={0.02}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left Column: Heading */}
                <div className="space-y-2">
                    <h2 className="text-brand-yellow" style={{ fontSize: 'clamp(12px, 4vw + 10px, 3rem)' }}>
                        <span className="whitespace-nowrap">Resumes don't impress us.</span>
                        <br />
                        <span className="font-zin-italic">Sisu does.</span>
                    </h2>
                </div>

                {/* Right Column: Content & Action */}
                <div className="space-y-8 lg:pl-12">
                    <p className="text-lg sm:text-xl text-pastel-yellow leading-relaxed max-w-xl">
                        Sisu is a Finnish idea. It’s about doing whatever it takes to win in the face of adversity.
                        It is how we survived the early days and how we’ll nail the endless pursuit ahead. If this resonates, we’d like to hear from you.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <span className="text-sm font-bold tracking-widest uppercase text-pastel-yellow pt-3 sm:pt-0">
                            WANT TO JOIN US?
                        </span>
                        <Button
                            leftIcon={<ArrowRight size={16} strokeWidth={3} />}
                            variant="primary"
                            href="https://empty-bite-b73.notion.site/Flent-Hiring-Guide-42ffc8b1ff6648869f4c45f85ec5a1b8"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            CHECK OPEN ROLES
                        </Button>
                    </div>
                </div>
            </div>
        </CardSection>
    );
};
