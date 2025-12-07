import { OpenSection } from "@/components/layout/OpenSection";

export const StorySection = () => {
    return (
        <OpenSection className="bg-bg-white py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#F3F1EB] text-sm font-medium text-primary-black/60">
                        About / <span className="text-primary-black">The story so far</span>
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <h2 className="text-fluid-h2 font-bold font-heading text-text-main mb-6">
                            We started by leasing & furnishing a few homes in the hopes of renting them out at a premium, <br /> <span className="text-primary-black font-zin italic">and it took off.</span>
                        </h2>
                    </div>

                    <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-8 pt-8 lg:pt-32">
                        <p className="text-lg text-primary-black/80 leading-relaxed">
                            Thanks to word of mouth, we&apos;ve grown to <b>150+ homes</b>, <b>360 residents</b>, and a waitlist of over <b>1,000 people</b>, backed by <b>Incubate Fund</b> and <b>WEH Ventures</b>.
                        </p>
                        <p className="text-lg text-primary-black/80 leading-relaxed">
                            Flent is now the default choice for experience-first renting in Bengaluru.
                        </p>
                        <p className="text-lg text-primary-black/80 leading-relaxed">
                            But thoughtfully designed rental homes were only the beginning. Our mission now is to forever change how affluent India experiences real estate.
                            From rental insurance to flatmate matching to an AI-powered broker that helps you choose the right locality, we're building a suite of products around how people actually want to interact with residential real estate — as an asset, as a place to live, and everything in between.
                        </p>
                    </div>
                </div>
            </div>
        </OpenSection>
    );
};
