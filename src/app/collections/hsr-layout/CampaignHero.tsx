"use client";

import React from "react";
import Lottie from "lottie-react";
import { useLottieData } from "@/hooks/useLottieData";

export const CampaignHero = () => {
  const lottieData = useLottieData("/campaign-lotties/Search.json");

  return (
    <section className="px-4 pt-24 pb-4 bg-bg-white flex flex-col items-center gap-6">
      <div className="w-full rounded-t-[2rem] border border-text-main pb-6 bg-bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/patterns/pie-factory.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "16px 16px",
            opacity: 0.09,
          }}
        />
        <div className="relative z-[1] flex flex-col items-center gap-[1.5rem]">
          <div className="aspect-square w-full overflow-hidden">
            {lottieData ? (
              <Lottie
                animationData={lottieData}
                loop
                autoplay
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 animate-pulse" />
            )}
          </div>
          <p className="text-fluid-h3 font-heading font-zin-italic text-text-main text-center">
            For homes that <span className="text-forest-green">love</span> you back
          </p>
        </div>
      </div>
    </section>
  );
}