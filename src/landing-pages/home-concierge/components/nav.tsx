"use client"

import Image from "next/image"
import { triggerFormAttention } from "@landing-pages/home-concierge/lib/form-attention"

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
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
          className="rounded-full bg-flent-green px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-flent-green/90"
        >
          Find your home →
        </button>
      </div>
    </nav>
  )
}
