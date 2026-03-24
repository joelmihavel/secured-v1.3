"use client"

import { triggerFormAttention } from "@/lib/home-concierge-form-attention"

const qualificationPills = [
  { label: "Fully furnished homes", color: "bg-flent-red" },
  { label: "Secured Localities", color: "bg-flent-violet" },
  { label: "From ₹25,000/month", color: "bg-flent-green" },
  { label: "Minimal deposits", color: "bg-flent-orange" },
  { label: "24/7 resident support", color: "bg-flent-red" },
  { label: "Kitchenware included", color: "bg-flent-yellow" },
]

export function Hero() {
  return (
    <section className="animate-fade-up">
      {/* Availability tag */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5E0D8] bg-white px-4 py-2 shadow-sm">
        <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-flent-green" />
        <span className="text-sm font-medium text-flent-dark">Premium homes available now</span>
      </div>

      {/* Headline */}
      <h1 className="mb-6 font-serif text-5xl font-bold leading-[1.1] tracking-tight text-flent-dark lg:text-7xl">
        Renting that finally respects{" "}
        <em className="text-flent-red">your taste and time.</em>
      </h1>

      {/* Subheadline */}
      <p className="animate-fade-up-delay-1 mb-8 max-w-xl text-lg leading-relaxed text-[#6B6B6B]">
        Fully furnished private rooms in curated homes. Move in with just your clothes.
        No brokerage, no landlord drama, premium aesthetics.
      </p>

      {/* Qualification pills */}
      <div className="animate-fade-up-delay-2 flex flex-wrap gap-3">
        {qualificationPills.map((pill) => (
          <button
            key={pill.label}
            type="button"
            onClick={triggerFormAttention}
            className="inline-flex items-center gap-2 rounded-full border border-[#E5E0D8] bg-white px-4 py-2 text-sm font-medium text-flent-dark shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className={`inline-block h-2 w-2 rounded-full ${pill.color}`} aria-hidden="true" />
            {pill.label}
          </button>
        ))}
      </div>
    </section>
  )
}
