"use client"

import Image from "next/image"
import { triggerFormAttention } from "@/lib/home-concierge-form-attention"

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#E5E0D8] bg-flent-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Image
          src="/flent-logo.png"
          alt="Flent"
          width={80}
          height={32}
          className="h-8 w-auto"
          priority
        />
        <button
          type="button"
          onClick={triggerFormAttention}
          className="rounded-full bg-flent-dark px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-flent-dark/90"
        >
          Request a callback
        </button>
      </div>
    </nav>
  )
}
