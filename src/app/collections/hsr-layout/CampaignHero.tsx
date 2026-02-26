"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

export const CampaignHero = () => {
  const [lottieData, setLottieData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/campaign-lotties/hsr-layout.json")
      .then((res) => res.json())
      .then(setLottieData)
      .catch(console.error);
  }, []);

  return (
    <section className="px-4 pt-24 pb-4 bg-bg-white flex flex-col items-center gap-6">
      <div className="w-full rounded-xl border border-text-main p-2 pb-6 bg-bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/patterns/pie-factory.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "60px 60px",
            opacity: 0.05,
          }}
        />
        <div className="relative z-[1] flex flex-col items-center gap-6">
          <div className="aspect-square w-full overflow-hidden rounded-xl border border-text-main">
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