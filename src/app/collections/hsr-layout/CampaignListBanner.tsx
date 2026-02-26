"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

export const CampaignListBanner = () => {
  const [lottieData, setLottieData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/campaign-lotties/hsr-list.json")
      .then((res) => res.json())
      .then(setLottieData)
      .catch(console.error);
  }, []);

  return (
    <section className="px-4 py-4 bg-bg-white">
      <div className="w-full overflow-hidden rounded-xl border border-text-main">
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
