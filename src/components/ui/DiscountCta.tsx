"use client";

import Lottie from "lottie-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useLottieData } from "@/hooks/useLottieData";

export const DiscountCta = () => {
  const homeBounceLottie = useLottieData("/lotties/home-bounce.json");

  return (
    <div className="flex flex-col relative w-full h-full">
      <div className="rounded-t-[2rem] overflow-hidden flex flex-col relative h-full">
        <div className="h-full w-full flex flex-col items-center justify-center text-center gap-4 text-text-main p-12 md:p-[3.5rem] flex-grow">
          {homeBounceLottie ? (
            <Lottie
              animationData={homeBounceLottie}
              loop
              autoplay
              className="w-[78%] max-w-[320px] h-auto"
            />
          ) : null}
          <div className="flex flex-col gap-2">
            <h3 className="text-fluid-h3 font-zin leading-tight">Early Bird Deals</h3>
            <p className="font-body text-sm md:text-base leading-relaxed">
              Explore deals for great homes with
              <br />
              ZERO compromise
            </p>
          </div>
          <div className="w-full max-w-xs">
            <Link href="/deals" className="block w-full">
              <Button
                variant="primary"
                size="md"
                className="w-full rounded-tr-[1rem] rounded-tl-none rounded-bl-none rounded-br-[1rem]"
              >
                Explore
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
