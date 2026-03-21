"use client";

import Image from "next/image";

export function StickyQR() {
  return (
    <div className="fixed bottom-[108px] right-12 z-50 hidden md:flex md:items-center" style={{ height: 40 }}>
      <a
        href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl bg-black p-3 shadow-[0px_8px_24px_rgba(0,0,0,0.4)] transition-all duration-200 hover:scale-105 hover:shadow-[0px_12px_32px_rgba(255,154,109,0.3)]"
      >
        <Image
          src="/assets/logos/qr-code.svg"
          alt="Scan QR to download Flent"
          width={96}
          height={96}
        />
      </a>
    </div>
  );
}
