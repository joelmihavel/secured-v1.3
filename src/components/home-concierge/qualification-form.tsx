"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Lock, Phone, Zap } from "lucide-react"

const budgetOptions = [
  "₹25,000–₹30,000",
  "₹30,000–₹35,000",
  "₹35,000–₹45,000",
  "₹45,000+",
]

const areaOptions = [
  "HSR Layout",
  "Koramangala",
  "Indiranagar",
  "Bellandur–Sarjapura",
  "Whitefield",
  "Ulsoor–MG Road",
  "Open to suggestions",
]

async function submitToHubSpot(name: string, phone: string, email: string, budget: string, area: string) {
  const portalId = "45469632"
  const formId = "5413c5b2-25f5-4891-979d-b147207abee0"
  const url = `https://api-na2.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: [
        { name: "firstname", value: name },
        { name: "email", value: email },
        { name: "phone", value: phone },
        { name: "budget_range", value: budget },
        { name: "preferred_area", value: area },
      ],
      context: {
        pageUri: window.location.href,
        pageName: "Flent Home Concierge",
      },
    }),
  })
}

export function QualificationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const form = document.getElementById("flent-form")
    if (!form) return
    const handleAnimationEnd = () => form.classList.remove("attention")
    form.addEventListener("animationend", handleAnimationEnd)
    return () => form.removeEventListener("animationend", handleAnimationEnd)
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setLoading(true)
    try {
      await submitToHubSpot(
        formData.get("name") as string,
        formData.get("phone") as string,
        formData.get("email") as string,
        formData.get("budget") as string,
        formData.get("area") as string,
      )
    } catch {
      // Silently fail — still show success
    }
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div id="flent-form" className="hc-form-card overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white shadow-lg">
        <div className="relative overflow-hidden bg-flent-green px-6 py-8 text-center">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />
          <p className="relative font-serif text-3xl font-bold text-white">
            {"You're on our radar."}
          </p>
        </div>
        <div className="px-6 py-8 text-center">
          <p className="text-base leading-relaxed text-flent-dark">
            A Flent home concierge will call you shortly. Keep your phone close.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div id="flent-form" className="hc-form-card overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white shadow-lg">
      {/* Green header */}
      <div className="relative overflow-hidden bg-flent-green px-6 py-8">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />
        <div className="relative">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-flent-yellow">
            Your home concierge
          </p>
          <p className="font-serif text-2xl font-bold text-white">Find your Flent home.</p>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            {"Tell us a little. We'll do the rest — and call you within the hour."}
          </p>
        </div>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
        <div>
          <label htmlFor="form-name" className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]">
            Name
          </label>
          <input
            id="form-name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className="hc-flent-input w-full rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark placeholder:text-[#999] focus:border-flent-green focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="form-phone" className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]">
            Phone
          </label>
          <input
            id="form-phone"
            name="phone"
            type="tel"
            required
            placeholder="+91 98765 43210"
            pattern="[+]?[0-9\s]{10,15}"
            className="hc-flent-input w-full rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark placeholder:text-[#999] focus:border-flent-green focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="form-email" className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]">
            Email
          </label>
          <input
            id="form-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="hc-flent-input w-full rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark placeholder:text-[#999] focus:border-flent-green focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="form-budget" className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]">
            Budget
          </label>
          <select
            id="form-budget"
            name="budget"
            required
            defaultValue=""
            className="hc-flent-input w-full appearance-none rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark focus:border-flent-green focus:bg-white focus:outline-none"
          >
            <option value="" disabled>Select your budget</option>
            {budgetOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="form-area" className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]">
            Preferred area
          </label>
          <select
            id="form-area"
            name="area"
            required
            defaultValue=""
            className="hc-flent-input w-full appearance-none rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark focus:border-flent-green focus:bg-white focus:outline-none"
          >
            <option value="" disabled>Select an area</option>
            {areaOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-[14px] bg-flent-dark px-6 py-4 text-sm font-extrabold text-white transition-colors hover:bg-flent-green disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Show me homes →"}
        </button>

        <p className="text-center text-xs leading-relaxed text-[#6B6B6B]">
          No spam. No brokers. A real Flent person calls you — usually within 24 hours.
        </p>

        <div className="flex items-center justify-center gap-4 border-t border-[#E5E0D8] pt-4 text-xs text-[#6B6B6B]">
          <span className="inline-flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Private
          </span>
          <span className="inline-flex items-center gap-1">
            <Phone className="h-3 w-3" />
            Real human calls you
          </span>
          <span className="inline-flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {"Response within 24hr"}
          </span>
        </div>
      </form>
    </div>
  )
}
