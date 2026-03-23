// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import "./renewal-guide.css"
import { CheckCircle2, HelpCircle, Loader2, ChevronRight, Sparkles, Calendar } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import axios from "axios"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
const API = `${BACKEND_URL}/api`

const FAQ_CATEGORIES = [
  {
    category: "Renewal & Lock-in",
    faqs: [
      {
        question: "What happens if I don't confirm my renewal in time?",
        answer: "If we don't receive confirmation before the renewal deadline, the renewal will happen at the standard escalation percentage and you will lose your savings."
      },
      {
        question: "Can I cancel my renewal after confirming it?",
        answer: "Once the renewal terms are locked-in on the system, a cancellation may attract security deposit forfeiture."
      },
      {
        question: "Can I increase my lock-in period later and still get the same discounts?",
        answer: "Lock-in choices made during renewal are fixed for the duration of that term. You may be able to extend the lock-in after the initial lock-in period ends, depending on program availability. Any discounts offered at that time will be subject to Flent's discretion."
      },
      {
        question: "How is rent calculated if my renewal starts mid-month?",
        answer: "If your renewal begins mid-month, the rent for the remaining days will be prorated based on the renewal date and added to the following month's rent invoice."
      }
    ]
  },
  {
    category: "Pricing & Escalation",
    faqs: [
      {
        question: "Why is my rent increasing?",
        answer: "Rent is periodically revised to stay aligned with current market rates which is levied by the landlord."
      },
      {
        question: "What is escalation applied on?",
        answer: "Escalation is applied on the total rent, which includes both the base rent and the service fee."
      },
      {
        question: "Will my rent change again during the new lock-in?",
        answer: "No. Once your renewal is confirmed, the revised rent will remain fixed for the duration of the new lock-in period."
      },
      {
        question: "Are these discounts and benefits lifetime offers?",
        answer: "No. The discounts and benefits offered are exclusive to this renewal term. Once the term ends, the rent will revert to the base rent along with the standard escalation applicable at that time."
      }
    ]
  },
  {
    category: "General",
    faqs: [
      {
        question: "Can I switch rooms or properties during renewal?",
        answer: "You cannot switch rooms/homes during the lock-in period. Switching homes may attract forfeiture of security deposit."
      }
    ]
  }
]

const SAVINGS_OPTIONS = [
  { id: "save-0", discount: 0, lockIn: 0, label: "No Lock-in", lockInLabel: "Flexible" },
  { id: "save-30", discount: 30, lockIn: 6, label: "6 Months", lockInLabel: "6 months lock-in" },
  { id: "save-40", discount: 40, lockIn: 9, label: "9 Months", lockInLabel: "9 months lock-in" },
  { id: "save-50", discount: 50, lockIn: 11, label: "11 Months", lockInLabel: "11 months lock-in" },
]

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const FlentLogo = () => (
  <svg className="h-8 mx-auto" viewBox="0 0 67 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.8154 0C4.70982 0 0.901793 4.86149 2.29137 9.60615L0 9.61435V12.6661H2.29547V24H7.53612V12.6661H11.6003V9.58565H9.74142C7.16516 9.58565 5.6772 8.15098 5.6772 6.14654C5.6772 4.47208 7.37216 3.17882 9.29257 3.17882C13.5822 3.17882 14.8468 6.87822 14.8468 6.87822V24H20.0874V4.3696C18.8967 2.82015 15.6174 0 10.8154 0Z" fill="#18181b"/>
    <path d="M26.9894 16.2589L36.5566 13.3793C36.5566 13.1928 36.5566 13.0084 36.5259 12.8219C36.2779 10.2518 34.296 7.58942 29.7132 7.58942C25.4707 7.58942 21.9107 10.8707 21.9107 16.0417C21.9107 20.9032 25.565 24 29.8055 24C34.0459 24 36.3086 21.8951 36.6181 18.6118C35.7204 19.4173 34.2037 19.9132 32.4698 19.9132C30.5802 19.9132 27.9486 19.077 26.9894 16.2589ZM29.25 10.0366C30.6437 10.0366 31.7279 11.0265 31.5107 13.7831H26.6184C26.6184 11.5532 27.7334 10.0366 29.25 10.0366Z" fill="#18181b"/>
    <path d="M48.6274 7.8989C45.9036 7.8989 44.3849 9.38481 43.643 10.965V7.92964L38.4413 8.51786V24H43.643V11.6454C44.0754 11.5225 44.4792 11.4282 44.9752 11.4282C47.0801 11.4282 48.072 12.6354 48.072 14.9882V23.998H53.2737V13.3158C53.2737 9.53852 51.1996 7.89685 48.6295 7.89685L48.6274 7.8989Z" fill="#18181b"/>
    <path d="M62.7151 8.20838V3.56415L57.5134 4.18311V8.20838H55.097V10.9957H57.5134V24H62.7151V10.9957H66.8941V8.20838H62.7151Z" fill="#18181b"/>
  </svg>
)

export default function RenewalGuidePage() {
  const [currentRent, setCurrentRent] = useState(50000)
  const [escalation, setEscalation] = useState(10)
  const [tenantEmail, setTenantEmail] = useState("")
  const [tenantName, setTenantName] = useState("")
  const [selectedSavings, setSelectedSavings] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const email = params.get("email") || ""
    const name = params.get("name") || ""
    const rentParam = params.get("current_rent") || params.get("rent")
    const rentParsed = rentParam ? parseInt(rentParam.replace(/,/g, "")) : NaN
    const rent = !isNaN(rentParsed) ? rentParsed : 50000
    const esc = params.get("escalation") ? parseFloat(params.get("escalation")) : 10
    setTenantEmail(email)
    setTenantName(name)
    setCurrentRent(rent)
    setEscalation(esc)
  }, [])

  const escalationAmount = (currentRent * escalation) / 100
  const newBaseRent = currentRent + escalationAmount

  const calculateSavings = (option) => {
    const discountAmount = (escalationAmount * option.discount) / 100
    const totalSavings = discountAmount * 11
    const newMonthlyRent = newBaseRent - discountAmount
    return { discountAmount, totalSavings, newMonthlyRent }
  }

  const selectedOption = selectedSavings ? SAVINGS_OPTIONS.find((opt) => opt.id === selectedSavings) : null
  const selectedCalc = selectedOption ? calculateSavings(selectedOption) : null

  const handleSubmit = async () => {
    if (!tenantEmail) {
      setSubmitStatus("error")
      setSubmitMessage("Please enter your email address.")
      return
    }
    if (!selectedOption) {
      setSubmitStatus("error")
      setSubmitMessage("Please select a savings plan.")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await axios.post(`${API}/renewal/submit`, {
        tenant_email: tenantEmail,
        tenant_name: tenantName || null,
        current_rent: currentRent,
        escalation_percent: escalation,
        lockin_months: selectedOption.lockIn,
        lockin_label: selectedOption.label + " Lock-in",
        discount_percent: selectedOption.discount,
        new_monthly_rent: selectedCalc.newMonthlyRent,
        total_savings: selectedCalc.totalSavings,
      })
      setSubmitStatus("success")
      setSubmitMessage(response.data.message)
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage(error.response?.data?.detail || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const bgStyle = { background: "repeating-linear-gradient(135deg, #f8f8f8 0px, #f8f8f8 10px, #f4f4f4 10px, #f4f4f4 20px)" }

  if (submitStatus === "success") {
    return (
      <div className="renewal-root min-h-screen" style={bgStyle}>
        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <a href="https://flent.in"><FlentLogo /></a>
          </div>
          <Card className="bg-white border-zinc-200 rounded-2xl shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#008E7515" }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: "#008E75" }} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                You're All Set!
              </h2>
              <p className="text-zinc-500 mb-6">{submitMessage}</p>
              <div className="bg-zinc-50 rounded-lg p-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Total Savings</span>
                    <span className="font-bold" style={{ color: "#008E75" }}>{formatCurrency(selectedCalc.totalSavings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Lock-in Period</span>
                    <span className="text-zinc-800 font-medium">{selectedOption.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">New Monthly Rent</span>
                    <span className="text-zinc-800 font-mono">{formatCurrency(selectedCalc.newMonthlyRent)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="renewal-root min-h-screen" style={bgStyle}>
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* Logo */}
        <div className="text-center mb-8">
          <a href="https://flent.in" target="_blank" rel="noopener noreferrer"><FlentLogo /></a>
        </div>

        {/* Congratulations Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            🎉 Congratulations on Completing Your First Term!
          </h1>
          <p className="text-zinc-600 text-base max-w-2xl mx-auto leading-relaxed mb-3">
            Your journey with Flent has been amazing, and we want to make your next chapter even better.
            As a thank you for choosing to call Flent home, we've crafted an exclusive <strong>Savings Program</strong> just for you.
          </p>
          <p className="text-zinc-600 text-base max-w-2xl mx-auto leading-relaxed mb-6">
            The longer you stay, the more you save — it's our way of rewarding your trust and long-term association.
            Choose your savings below and lock in the best deal for your next term.{" "}
            <span className="font-semibold" style={{ color: "#008E75" }}>Up to 50% off on escalation awaits!</span>
          </p>
          <div className="flex justify-center gap-10 pt-5 border-t border-zinc-100">
            <div className="text-center">
              <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1.5">Current Rent</p>
              <p className="font-mono font-semibold text-zinc-800 text-base">{formatCurrency(currentRent)}</p>
            </div>
            <div className="text-center">
              <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1.5">Escalation</p>
              <p className="font-mono font-semibold text-zinc-800 text-base">{escalation}%</p>
            </div>
            <div className="text-center">
              <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1.5">New Base Rent</p>
              <p className="font-mono font-semibold text-base" style={{ color: "#18181b" }}>
                {formatCurrency(newBaseRent)}
              </p>
            </div>
          </div>
        </div>

        {/* Email / Name */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-500 text-xs uppercase tracking-widest mb-1.5 block">Email *</label>
                <Input
                  type="email"
                  value={tenantEmail}
                  onChange={(e) => setTenantEmail(e.target.value)}
                  className="bg-white border-zinc-200 text-zinc-900 h-11 text-sm rounded-lg"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-zinc-500 text-xs uppercase tracking-widest mb-1.5 block">Name</label>
                <Input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="bg-white border-zinc-200 text-zinc-900 h-11 text-sm rounded-lg"
                  placeholder="John Doe"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="text-center mb-6">
          <p className="text-zinc-400 text-xs uppercase tracking-widest font-medium">How much would you like to save?</p>
        </div>

        {/* Savings Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {SAVINGS_OPTIONS.map((option) => {
            const { totalSavings } = calculateSavings(option)
            const isSelected = selectedSavings === option.id
            return (
              <button
                key={option.id}
                onClick={() => setSelectedSavings(option.id)}
                className="relative p-5 rounded-xl border-2 transition-all text-center bg-white hover:border-zinc-300"
                style={isSelected
                  ? { borderColor: "#008E75", background: "#ffffff", boxShadow: "0 4px 20px rgba(0, 142, 117, 0.12)" }
                  : { borderColor: "#e4e4e7" }
                }
              >
                {isSelected && (
                  <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#008E75" }}>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="mb-3">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-bold tracking-wide"
                    style={{ background: option.discount > 0 ? "#008E75" : "#e4e4e7", color: option.discount > 0 ? "white" : "#71717a" }}
                  >
                    {option.discount > 0 ? `${option.discount}% OFF` : "NO DISCOUNT"}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold mb-3" style={{ color: isSelected ? "#008E75" : "#18181b", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {formatCurrency(totalSavings)}
                </p>
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#FFE988", color: "#7a6800" }}>
                  {option.lockInLabel}
                </span>
              </button>
            )
          })}
        </div>

        {/* Deal Summary */}
        {selectedOption ? (
          <div className="max-w-lg mx-auto mb-8">
            <Card className="border-2 rounded-xl overflow-hidden" style={{ borderColor: "#008E75" }}>
              <div className="px-5 py-3 flex items-center gap-2" style={{ background: "#008E75" }}>
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-sm">Your Deal for Next Term</span>
              </div>
              <CardContent className="p-5 bg-white">
                <div className="space-y-0">
                  <div className="flex justify-between items-start py-3 border-b border-zinc-100">
                    <div>
                      <p className="text-zinc-800 font-medium text-sm">Monthly Escalated Base Rent</p>
                      <p className="text-zinc-400 text-xs mt-0.5">Current rent + {escalation}% escalation</p>
                    </div>
                    <p className="font-mono text-zinc-800 font-semibold text-sm">{formatCurrency(newBaseRent)}</p>
                  </div>
                  <div className="flex justify-between items-start py-3 border-b border-zinc-100">
                    <div>
                      <p className="text-zinc-800 font-medium text-sm">Discount on Escalation</p>
                      <p className="text-zinc-400 text-xs mt-0.5">{selectedOption.discount}% off on {formatCurrency(escalationAmount)}</p>
                    </div>
                    <p className="font-mono font-semibold text-sm" style={{ color: selectedOption.discount > 0 ? "#008E75" : "#a1a1aa" }}>
                      {selectedOption.discount > 0 ? `-${formatCurrency(selectedCalc.discountAmount)}` : "₹0"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-zinc-100">
                    <div>
                      <p className="text-zinc-800 font-medium text-sm">Lock-in Contract Term</p>
                      <p className="text-zinc-400 text-xs mt-0.5">Minimum commitment period</p>
                    </div>
                    <span className="font-semibold px-3 py-1 rounded-full text-xs" style={{ background: "#FFE988", color: "#7a6800" }}>
                      {selectedOption.lockIn > 0 ? `${selectedOption.lockIn} Months` : "Flexible"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-3 -mx-3 mt-1 rounded-lg" style={{ background: "#f4f4f5" }}>
                    <p className="text-zinc-800 font-semibold text-sm">Your New Monthly Rent</p>
                    <p className="font-mono text-xl font-bold text-zinc-900">{formatCurrency(selectedCalc.newMonthlyRent)}</p>
                  </div>
                  <div className="flex justify-between items-center py-3 px-3 -mx-3 rounded-lg mt-2" style={{ background: "#008E7512" }}>
                    <p className="font-semibold text-sm" style={{ color: "#008E75" }}>Total Term Savings (11 months)</p>
                    <p className="font-mono text-xl font-bold" style={{ color: "#008E75" }}>{formatCurrency(selectedCalc.totalSavings)}</p>
                  </div>
                </div>

                {submitStatus === "error" && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-red-600 text-sm">{submitMessage}</p>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !tenantEmail}
                  className="w-full h-12 mt-5 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "#008E75" }}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Confirming...</>
                  ) : (
                    <>Confirm My Choice<ChevronRight className="w-4 h-4" /></>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-lg mx-auto mb-8 text-center py-10 border-2 border-dashed border-zinc-200 rounded-xl bg-white/60">
            <p className="text-zinc-400 text-sm">Select a savings option above to see your deal</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-zinc-400 text-xs leading-relaxed">
            * These exclusive discounts are extended by Flent only for the upcoming renewal term.
            After this term ends, standard escalation and base rent will apply for subsequent renewals.
          </p>
        </div>

        {/* Help Button */}
        <div className="text-center mb-10">
          <a
            href="https://calendar.app.google/DumGhTWdbLPNUzRf7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "#FFE988", color: "#7a6800" }}
          >
            <Calendar className="w-4 h-4" />
            Need help deciding? Block some time
          </a>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="border border-zinc-200 rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center gap-2 bg-white">
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-semibold text-zinc-700">Frequently Asked Questions</span>
            </div>
            <Accordion type="multiple" className="divide-y divide-zinc-100">
              {FAQ_CATEGORIES.map((category, catIndex) => (
                <AccordionItem key={catIndex} value={`cat-${catIndex}`} className="border-0">
                  <AccordionTrigger
                    className="px-5 py-3.5 text-sm font-semibold hover:no-underline hover:bg-zinc-50"
                    style={{ color: "#008E75" }}
                  >
                    {category.category}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-3">
                    <div className="space-y-2">
                      {category.faqs.map((faq, faqIndex) => (
                        <Accordion key={faqIndex} type="single" collapsible>
                          <AccordionItem value={`faq-${catIndex}-${faqIndex}`} className="border border-zinc-100 rounded-lg">
                            <AccordionTrigger className="px-3 py-2.5 text-left text-zinc-700 hover:no-underline text-sm hover:bg-zinc-50 rounded-lg">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-3 pb-3 text-zinc-500 text-sm leading-relaxed">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}
