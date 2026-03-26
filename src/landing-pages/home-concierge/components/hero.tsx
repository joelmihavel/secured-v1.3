"use client"

import { triggerFormAttention } from "@landing-pages/home-concierge/lib/form-attention"

const qualificationPills = [
  { label: "Fully furnished", border: "border-flent-red", dot: "bg-flent-red" },
  { label: "Secured areas", border: "border-flent-violet", dot: "bg-flent-violet" },
  { label: "From ₹25k/mo", border: "border-flent-green", dot: "bg-flent-green" },
  { label: "Low deposits", border: "border-flent-orange", dot: "bg-flent-orange" },
  { label: "24/7 support", border: "border-flent-red", dot: "bg-flent-red" },
  { label: "Kitchen ready", border: "border-flent-yellow", dot: "bg-flent-yellow" },
]

export function Hero() {
  return (
    <section className="animate-fade-up">
      {/* Availability tag */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
        <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-flent-green" />
        <span className="text-sm font-medium text-flent-dark">
          Premium homes available now
        </span>
      </div>

      {/* Headline */}
      <h1 className="mb-6 font-serif text-5xl font-bold leading-[1.1] tracking-tight text-flent-dark lg:text-7xl">
        Renting that finally respects{" "}
        <em className="text-flent-red">your taste and time.</em>
      </h1>

      {/* Subheadline */}
      <p className="animate-fade-up-delay-1 mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
        Fully furnished private rooms in curated homes. Move in with
        just your clothes. No brokerage, no landlord drama, premium aesthetics.
      </p>

      {/* Qualification pills - 3x2 grid */}
      <div className="animate-fade-up-delay-2 grid grid-cols-3 gap-2 lg:gap-3">
        {qualificationPills.map((pill) => (
          <button
            key={pill.label}
            type="button"
            onClick={triggerFormAttention}
            className={`flex items-center justify-center gap-1.5 rounded-full border-2 bg-card px-2.5 py-2 text-xs font-medium text-flent-dark transition-all hover:-translate-y-0.5 hover:shadow-md lg:border lg:border-border lg:px-4 lg:text-sm ${pill.border} lg:border-border`}
          >
            <span className={`hidden h-1.5 w-1.5 shrink-0 rounded-full lg:inline-block ${pill.dot}`} />
            {pill.label}
          </button>
        ))}
      </div>
    </section>
  )
}
