"use client";

import { WordReveal, SlideUp } from "./ui/TextReveal";
import { AsciiBackground } from "./AsciiBackground";
import type { DownloadAppContent } from "@/lib/secured/types";

function Crosshair({ className }: { className: string }) {
  return (
    <span className={`absolute z-[4] ${className}`}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="3xl:w-6 3xl:h-6 4xl:w-7 4xl:h-7 5xl:w-9 5xl:h-9">
        <line x1="10" y1="0" x2="10" y2="20" stroke="#ff9a6d" strokeWidth="0.5" opacity="0.35" />
        <line x1="0" y1="10" x2="20" y2="10" stroke="#ff9a6d" strokeWidth="0.5" opacity="0.35" />
        <circle cx="10" cy="10" r="1.8" fill="#ff9a6d" opacity="0.5" />
      </svg>
    </span>
  );
}

export function DownloadApp({ data }: { data: DownloadAppContent }) {
  return (
    <section id="download-app" className="relative bg-[#131313] py-6 md:py-10">
      <div className="relative mx-auto w-full px-6 md:px-12 lg:px-[160px]">
        <div
          className="relative overflow-hidden border border-white/[0.06]"
          style={{ background: "linear-gradient(180deg, #141414 0%, #121212 100%)" }}
        >
          {/* Crosshair accents at 4 corners */}
          <Crosshair className="-top-[10px] -left-[10px]" />
          <Crosshair className="-top-[10px] -right-[10px]" />
          <Crosshair className="-bottom-[10px] -left-[10px]" />
          <Crosshair className="-bottom-[10px] -right-[10px]" />

          {/* ASCII art background */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.22]" aria-hidden="true">
            <AsciiBackground
              imageSrc="/assets/backgrounds/apartment-building-hires.jpg"
              fontSize={6}
              brightnessBoost={1.6}
              parallaxStrength={0.2}
              scale={1}
            />
          </div>

          {/* Centered content */}
          <div className="relative z-10 flex flex-col items-center px-6 pb-10 pt-14 text-center md:pb-14 md:pt-20 lg:pb-16 lg:pt-24 3xl:pb-20 3xl:pt-32 4xl:pb-28 4xl:pt-40 5xl:pb-36 5xl:pt-52">
            <h2 className="font-display text-[36px] leading-[1.2] tracking-[-0.5px] text-white md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] 3xl:text-[84px] 4xl:text-[100px] 5xl:text-[132px]">
              <WordReveal>{data.heading}</WordReveal>
            </h2>

            <SlideUp delay={0.3} className="mt-3 md:mt-4">
              <p
                className="mx-auto max-w-[500px] text-base leading-[1.7] text-[#888] md:text-lg xl:max-w-[600px] xl:text-xl 3xl:max-w-[760px] 3xl:text-2xl 4xl:max-w-[960px] 4xl:text-3xl 5xl:max-w-[1200px] 5xl:text-4xl"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {data.description}
              </p>
            </SlideUp>

            {/* Two CTAs side by side */}
            <SlideUp delay={0.5} className="mt-6 md:mt-8">
              <div className="flex flex-col items-stretch gap-3 md:flex-row md:gap-4 3xl:gap-5 4xl:gap-6">
                {/* App Store — primary filled */}
                <a
                  href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#ff9a6d] px-7 py-3.5 transition-all duration-200 hover:bg-[#ffb08a] md:w-[260px] md:py-4 3xl:w-[320px] 3xl:py-5 4xl:w-[400px] 4xl:py-6 5xl:w-[520px] 5xl:py-7"
                >
                  <svg className="h-[18px] w-[18px] 3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-8 5xl:w-8" viewBox="0 0 24 24" fill="#131313">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span
                    className="text-[13px] font-semibold text-[#131313] md:text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {data.appStoreButtonText}
                  </span>
                </a>

                {/* Android — outlined, coming soon */}
                <div className="flex w-full items-center justify-center gap-2.5 rounded-full border border-white/[0.12] px-7 py-3.5 md:w-[260px] md:py-4 3xl:w-[320px] 3xl:py-5 4xl:w-[400px] 4xl:py-6 5xl:w-[520px] 5xl:py-7">
                  <svg className="h-[18px] w-[18px] 3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-8 5xl:w-8" viewBox="0 0 24 24" fill="#555">
                    <path d="M17.523 2.235a.5.5 0 0 0-.86.508l1.139 1.934A7.98 7.98 0 0 0 12 2.984a7.98 7.98 0 0 0-5.802 1.693L7.337 2.743a.5.5 0 0 0-.86-.508L5.163 4.59A8.46 8.46 0 0 0 3.5 10.5h17A8.46 8.46 0 0 0 18.837 4.59l-1.314-2.355zM8.5 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM3.5 11.5v7A1.5 1.5 0 0 0 5 20h1v2.5a1.5 1.5 0 0 0 3 0V20h6v2.5a1.5 1.5 0 0 0 3 0V20h1a1.5 1.5 0 0 0 1.5-1.5v-7h-17zM1 11.5a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5zm19 0a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0v-5z" />
                  </svg>
                  <span
                    className="text-[13px] font-medium text-[#555] md:text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    Coming soon for Android
                  </span>
                </div>
              </div>
            </SlideUp>
          </div>
        </div>
      </div>
    </section>
  );
}
