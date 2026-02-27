"use client";

import React from "react";
import Lottie from "lottie-react";
import { useLottieData } from "@/hooks/useLottieData";

export const CampaignListBanner = () => {
  const lottieData = useLottieData("/campaign-lotties/list-16-9.json");

  return (
    <section className="bg-bg-white">
      <div className="w-full overflow-hidden rounded-tr-[2rem] rounded-br-[2rem] border border-text-main">
        {lottieData ? (
          <Lottie
            animationData={lottieData}
            loop
            autoplay
            className="w-full"
          />
        ) : (
          <div className="w-full bg-gray-100 animate-pulse" style={{ aspectRatio: "2743 / 375" }} />
        )}
      </div>
    </section>
  );
};
