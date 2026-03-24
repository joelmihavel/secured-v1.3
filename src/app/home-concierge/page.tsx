import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { TickerBar } from "@/components/home-concierge/ticker-bar"
import { Nav } from "@/components/home-concierge/nav"
import { Hero } from "@/components/home-concierge/hero"
import { StatsBar } from "@/components/home-concierge/stats-bar"
import { PropertyCards } from "@/components/home-concierge/property-cards"
import { RepellerBanner } from "@/components/home-concierge/repeller-banner"
import { Features } from "@/components/home-concierge/features"
import { Testimonials } from "@/components/home-concierge/testimonials"
import { QualificationForm } from "@/components/home-concierge/qualification-form"
import { MobileFormBar } from "@/components/home-concierge/mobile-form-bar"
import { Footer } from "@/components/home-concierge/footer"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Designer Furnished Rooms in Bangalore · From ₹30k/month · flent",
  description:
    "Private, fully furnished rooms in curated designer homes. For working professionals. Not a PG. Not coliving. From ₹30,000/month. Bangalore.",
}

export default function HomeConcierge() {
  return (
    <div className={`home-concierge-page min-h-screen ${playfair.variable}`}>
      <TickerBar />
      <Nav />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative flex flex-col gap-10 py-10 lg:flex-row lg:gap-12 lg:py-14">
          {/* Left column — all content */}
          <main className="flex min-w-0 flex-1 flex-col gap-14">
            <Hero />
            <StatsBar />
            <PropertyCards />
            <RepellerBanner />
            <Features />
            <Testimonials />
          </main>

          {/* Right column — sticky form (desktop only) */}
          <aside className="hidden w-[360px] shrink-0 lg:block">
            <div className="sticky top-[73px]">
              <QualificationForm />
            </div>
          </aside>
        </div>
      </div>

      <Footer />
      <MobileFormBar />

      {/* Bottom padding on mobile to account for sticky bar */}
      <div className="h-20 lg:hidden" />
    </div>
  )
}
