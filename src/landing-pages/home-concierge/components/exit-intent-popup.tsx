"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

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

async function submitToHubSpot(name: string, email: string, phone: string, budget: string, area: string) {
  const portalId = '45469632'
  const formId = '5413c5b2-25f5-4891-979d-b147207abee0'
  const url = `https://api-na2.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`

  const data = {
    fields: [
      { name: 'firstname', value: name },
      { name: 'email', value: email },
      { name: 'phone', value: phone },
      { name: 'budget_range', value: budget },
      { name: 'preferred_area', value: area }
    ],
    context: {
      pageUri: window.location.href,
      pageName: 'Flent Landing Page - Exit Intent'
    }
  }

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    // Check if already shown in this session
    const alreadyShown = sessionStorage.getItem('exitIntentShown')
    if (alreadyShown) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        setIsOpen(true)
        setHasTriggered(true)
        sessionStorage.setItem('exitIntentShown', 'true')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [hasTriggered])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const budget = formData.get("budget") as string
    const area = formData.get("area") as string

    setLoading(true)

    try {
      await submitToHubSpot(name, email, phone, budget, area)
    } catch {
      // Silently fail — still show success
    }

    setLoading(false)
    setSubmitted(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="mb-4 text-5xl">🏠</div>
            <h3 className="mb-2 font-serif text-2xl font-bold text-flent-dark">
              You're on our list!
            </h3>
            <p className="text-sm text-muted-foreground">
              We'll reach out within 12 hours with homes that match your preferences.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 rounded-full bg-flent-green px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flent-green/90"
            >
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <div className="bg-flent-green px-6 py-6 text-center">
              <p className="font-serif text-2xl font-bold text-white">
                Wait! Don't miss out
              </p>
              <p className="mt-1 text-sm text-white/80">
                Get personalized home recommendations
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-6">
              <input
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="w-full rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-flent-dark placeholder:text-[#999] focus:border-flent-green focus:bg-white focus:outline-none"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                className="w-full rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-flent-dark placeholder:text-[#999] focus:border-flent-green focus:bg-white focus:outline-none"
              />
              <input
                name="phone"
                type="tel"
                required
                placeholder="Phone number"
                pattern="[+]?[0-9\s]{10,15}"
                className="w-full rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-flent-dark placeholder:text-[#999] focus:border-flent-green focus:bg-white focus:outline-none"
              />
              <select
                name="budget"
                required
                defaultValue=""
                className="w-full appearance-none rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-flent-dark focus:border-flent-green focus:bg-white focus:outline-none"
              >
                <option value="" disabled>Select budget</option>
                {budgetOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <select
                name="area"
                required
                defaultValue=""
                className="w-full appearance-none rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-flent-dark focus:border-flent-green focus:bg-white focus:outline-none"
              >
                <option value="" disabled>Preferred area</option>
                {areaOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-[14px] bg-flent-dark px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-flent-green disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Get my personalized picks →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
