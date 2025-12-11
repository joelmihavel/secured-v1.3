"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { IconPlayerPlay as Play } from "@tabler/icons-react";
import { OpenSection } from "@/components/layout/OpenSection";

const stats = [
  {
    value: "10%",
    label: "Homes qualify our evaluation criteria",
    color: "text-white",
    bgColor: "bg-brick-red",
    rotation: -2,
  },
  {
    value: "58",
    label:
      "Quality checks across utilities and safety",
    color: "text-white",
    bgColor: "bg-forest-green",
    rotation: 3,
  },
  {
    value: "₹5L",
    label: "Avg. invested in design, furnishings & setup per home.",
    color: "text-white",
    bgColor: "bg-ground-brown",
    rotation: -1,
  },
];

// CountUp component for animating numbers
interface CountUpProps {
  end: string;
  color: string;
  duration?: number;
}

const CountUp: React.FC<CountUpProps> = ({ end, color, duration = 2 }) => {
  const [count, setCount] = useState<string>("");
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric value from the string
    const numericMatch = end.match(/[\d,]+/);
    if (!numericMatch) {
      // If no number found, just show the text
      setCount(end);
      return;
    }

    const numericStr = numericMatch[0].replace(/,/g, "");
    const targetValue = parseInt(numericStr, 10);

    // Extract prefix, suffix, and format
    const prefix = end.substring(0, end.indexOf(numericMatch[0]));
    const suffix = end.substring(
      end.indexOf(numericMatch[0]) + numericMatch[0].length
    );
    const hasCommas = numericMatch[0].includes(",");

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * targetValue);

      // Format with commas if original had them
      let formattedValue = currentValue.toString();
      if (hasCommas) {
        formattedValue = currentValue.toLocaleString("en-IN");
      }

      setCount(prefix + formattedValue + suffix);

      if (now < endTime) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animate();
  }, [isInView, end, duration]);

  return (
    <p
      ref={ref}
      className={`font-zin text-5xl md:text-6xl lg:text-7xl font-extrabold ${color}`}
    >
      {count || end}
    </p>
  );
};

export const Info = () => {
  return (
    <OpenSection className="bg-bg-white">
      {/* Video (Edge to Edge) */}
      <div className="w-full bg-white overflow-hidden flex items-center justify-center relative md:aspect-[2.5/1] aspect-[16/9]">
        {/* Torn Paper Edge - Top */}
        <div className="absolute top-0 left-0 w-full h-8 md:h-16 z-20 -translate-y-2 pointer-events-none">
          <svg className="w-full h-full text-bg-white fill-current">
            <defs>
              <filter
                id="paper-tear-top"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.012"
                  numOctaves="3"
                  seed="42"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="12"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
            <rect
              x="-10%"
              y="0"
              width="120%"
              height="18"
              filter="url(#paper-tear-top)"
              className="md:hidden"
            />
            <rect
              x="-10%"
              y="0"
              width="120%"
              height="36"
              filter="url(#paper-tear-top)"
              className="hidden md:block"
            />
          </svg>
        </div>

        {/* <div className="w-16 h-16 bg-brand-yellow border border-black flex items-center justify-center shadow-sm z-10">
          <Play className="w-6 h-6 text-black fill-current" />
        </div> */}
        {/* Video cover image */}
        {/* desktop */}
        <video
          src="https://res.cloudinary.com/djvdu4une/video/upload/v1764790071/Website_fold_horizontal__gb7eur.mp4"
          className="object-cover w-full h-full hidden md:block"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* mobile */}
        <video
          src="https://res.cloudinary.com/djvdu4une/video/upload/v1764790400/Website_fold_mobile_version_2_xgwpny.mp4"
          className="object-cover w-full h-full block md:hidden"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Torn Paper Edge */}
        <div className="absolute bottom-0 left-0 w-full h-8 md:h-16 z-20 translate-y-2 pointer-events-none">
          <svg className="w-full h-full text-bg-white fill-current">
            <defs>
              <filter
                id="paper-tear"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.012"
                  numOctaves="3"
                  seed="1"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="12"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
            <rect
              x="-10%"
              y="14"
              width="120%"
              height="100%"
              filter="url(#paper-tear)"
              className="md:hidden"
            />
            <rect
              x="-10%"
              y="28"
              width="120%"
              height="100%"
              filter="url(#paper-tear)"
              className="hidden md:block"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* Heading */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <h2 className="font-heading text-text-main leading-[1.1] text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold">
              A lot goes in <br className="hidden md:block" />
              before you walk <br className="hidden md:block" />
              into <span className="font-zin-italic">that home</span>
            </h2>
          </div>

          {/* Stats */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, rotate: stat.rotation }}
                  whileInView={{ opacity: 1, y: 0, rotate: stat.rotation }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`flex flex-col gap-4 items-center justify-center text-center ${stat.bgColor
                    } rounded-3xl p-8 shadow-lg aspect-[2/1] md:aspect-auto ${index === 2
                      ? "col-span-2 md:col-span-1 mx-auto max-w-md md:max-w-none"
                      : ""
                    }`}
                >
                  <CountUp end={stat.value} color={stat.color} duration={2.5} />
                  <p className="text-sm text-text-invert/80 font-heading leading-relaxed line-clamp-3">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OpenSection>
  );
};
