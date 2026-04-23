"use client";

import { useRef, useEffect } from "react";
import { gsap } from "./useGSAP";

interface FloatingProps {
  className?: string;
  children: React.ReactNode;
  speed?: number;
  direction?: "up" | "down";
  blur?: number;
  rotate?: number;
}

export function Floating({
  className = "",
  children,
  speed = 1,
  direction = "up",
  blur = 0,
  rotate = 0,
}: FloatingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const yAmt = direction === "up" ? -30 * speed : 30 * speed;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: yAmt,
        rotation: rotate,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2,
      });
    });

    return () => ctx.revert();
  }, [speed, direction, rotate]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute will-change-transform ${className}`}
      style={{ filter: blur > 0 ? `blur(${blur}px)` : undefined }}
    >
      {children}
    </div>
  );
}

export function RupeeCoin({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      <ellipse cx="32" cy="34" rx="28" ry="26" fill="#1a1a1a" opacity="0.5" />
      <circle cx="32" cy="30" r="28" fill="url(#coin-grad)" stroke="#ff9a6d" strokeWidth="1.5" />
      <circle cx="32" cy="30" r="22" stroke="#ff9a6d" strokeWidth="0.5" opacity="0.3" />
      <text
        x="32"
        y="37"
        textAnchor="middle"
        fill="#ff9a6d"
        fontSize="22"
        fontWeight="700"
        fontFamily="system-ui"
      >
        ₹
      </text>
      <defs>
        <radialGradient id="coin-grad" cx="0.4" cy="0.3">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function ShieldShape({ size = 80, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 80 96"
      fill="none"
      className={className}
    >
      <path
        d="M40 4L8 20V48C8 72 24 88 40 92C56 88 72 72 72 48V20L40 4Z"
        fill="#1a1a1a"
        stroke="#ff9a6d"
        strokeWidth="1"
        opacity="0.8"
      />
      <path
        d="M40 4L8 20V48C8 72 24 88 40 92C56 88 72 72 72 48V20L40 4Z"
        fill="url(#shield-glow)"
        opacity="0.15"
      />
      <path
        d="M28 48L36 56L52 40"
        stroke="#ff9a6d"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <defs>
        <radialGradient id="shield-glow" cx="0.5" cy="0.4">
          <stop offset="0%" stopColor="#ff9a6d" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function HouseShape({ size = 72, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      className={className}
    >
      <path
        d="M36 8L6 32V64H26V44H46V64H66V32L36 8Z"
        fill="#1a1a1a"
        stroke="#ff9a6d"
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M36 8L6 32V64H26V44H46V64H66V32L36 8Z"
        fill="url(#house-glow)"
        opacity="0.1"
      />
      <rect x="30" y="20" width="12" height="10" rx="1" stroke="#ff9a6d" strokeWidth="0.8" opacity="0.4" />
      <defs>
        <radialGradient id="house-glow" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#ff9a6d" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function StairShape({ size = 80, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
    >
      <path
        d="M10 70H30V50H50V30H70V10"
        stroke="#ff9a6d"
        strokeWidth="1.5"
        opacity="0.5"
        strokeLinecap="round"
      />
      <rect x="10" y="60" width="20" height="10" fill="#1a1a1a" stroke="#ff9a6d" strokeWidth="0.8" opacity="0.4" />
      <rect x="30" y="40" width="20" height="10" fill="#1a1a1a" stroke="#ff9a6d" strokeWidth="0.8" opacity="0.4" />
      <rect x="50" y="20" width="20" height="10" fill="#1a1a1a" stroke="#ff9a6d" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

export function CreditCardShape({ size = 96, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.63}
      viewBox="0 0 96 60"
      fill="none"
      className={className}
    >
      <rect
        x="2"
        y="2"
        width="92"
        height="56"
        rx="8"
        fill="#1a1a1a"
        stroke="#ff9a6d"
        strokeWidth="1"
        opacity="0.7"
      />
      <rect x="12" y="14" width="16" height="12" rx="2" stroke="#ff9a6d" strokeWidth="0.8" opacity="0.5" />
      <line x1="2" y1="34" x2="94" y2="34" stroke="#ff9a6d" strokeWidth="0.5" opacity="0.2" />
      <circle cx="78" cy="44" r="6" stroke="#ff9a6d" strokeWidth="0.8" opacity="0.3" />
      <circle cx="70" cy="44" r="6" stroke="#ff9a6d" strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}
