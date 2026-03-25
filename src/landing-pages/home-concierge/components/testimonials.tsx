"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

const testimonials = [
  {
    quote: "No brokers, no hefty deposits. Moved seamlessly between fully furnished homes.",
    name: "Ayush Tripathi",
    role: "Product Manager, MIQ",
  },
  {
    quote: "Originally booked for 3 months, happily extended to 12. The team is incredibly supportive.",
    name: "Harshit K",
    role: "Software Engineer, Walmart",
  },
  {
    quote: "Booked based on pictures alone — it was exactly as shown. The balcony is perfect for hangouts.",
    name: "Aayush Khazanchi",
    role: "Investment Banking Analyst, JM Financial",
  },
  {
    quote: "Pool view, great ventilation, tastefully furnished. Plus access to all building amenities.",
    name: "Gautam Kakadiya",
    role: "Senior Software Engineer, VerSe",
  },
]

const tweetImages = [
  "/tweets/Tweet 1.png",
  "/tweets/Tweet 2.png",
  "/tweets/Tweet 3.png",
  "/tweets/Tweet 5.png",
  "/tweets/Tweet 6.png",
  "/tweets/Tweet 7.png",
  "/tweets/Tweet 9.png",
  "/tweets/Tweet 10.png",
  "/tweets/Tweet 11.png",
  "/tweets/Tweet 12.png",
]

function MarqueeTrack({ children, direction = "left" }: { children: React.ReactNode; direction?: "left" | "right" }) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let animationId: number
    let position = direction === "left" ? 0 : -track.scrollWidth / 2

    const animate = () => {
      if (direction === "left") {
        position -= 0.5
        if (position <= -track.scrollWidth / 2) {
          position = 0
        }
      } else {
        position += 0.5
        if (position >= 0) {
          position = -track.scrollWidth / 2
        }
      }
      track.style.transform = `translateX(${position}px)`
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [direction])

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex gap-4 whitespace-nowrap">
        {children}
        {children}
      </div>
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="inline-flex w-64 shrink-0 flex-col rounded-xl border border-border bg-card p-4 shadow-sm lg:w-80 lg:rounded-2xl lg:p-5">
      <span className="mb-1 font-serif text-2xl leading-none text-flent-orange lg:mb-2 lg:text-3xl" aria-hidden="true">
        {"\u201C"}
      </span>
      <p className="mb-3 text-xs leading-relaxed text-flent-dark whitespace-normal lg:mb-4 lg:text-sm">
        {testimonial.quote}
      </p>
      <div className="mt-auto">
        <p className="text-xs font-bold text-flent-dark lg:text-sm">{testimonial.name}</p>
        <p className="text-[10px] text-muted-foreground lg:text-xs">{testimonial.role}</p>
      </div>
    </div>
  )
}

function TweetImage({ src }: { src: string }) {
  return (
    <div className="inline-block shrink-0 overflow-hidden rounded-lg shadow-sm lg:rounded-xl">
      <Image
        src={src}
        alt="Tweet from X"
        width={320}
        height={400}
        className="h-48 w-auto object-contain lg:h-72"
        unoptimized
      />
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="space-y-6 lg:space-y-8">
      <h2 className="font-serif text-2xl font-bold text-flent-dark lg:text-4xl">
        What residents say
      </h2>

      {/* Testimonials marquee */}
      <MarqueeTrack direction="left">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </MarqueeTrack>

      {/* Twitter social proof marquee - real screenshots */}
      <div className="pt-2 lg:pt-4">
        <h2 className="mb-3 font-serif text-2xl font-bold text-flent-dark lg:mb-4 lg:text-4xl">
          People on X
        </h2>
        <MarqueeTrack direction="right">
          {tweetImages.map((src) => (
            <TweetImage key={src} src={src} />
          ))}
        </MarqueeTrack>
      </div>
    </section>
  )
}
