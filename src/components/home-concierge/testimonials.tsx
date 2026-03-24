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

const tweets = [
  {
    name: "Deepankar",
    handle: "@DeepankarBhade",
    verified: true,
    text: "can't believe this house is in indiranagar.",
    date: "Oct 5, 2025",
    views: "62K",
    likes: 602,
    retweets: 20,
    replies: 40,
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Kritika kumari",
    handle: "@kritikatwtss",
    verified: true,
    text: "Okay but why do @flenthomes look like they were designed by some artist??? I didn't know Bangalore rental homes had so much potential ✨",
    date: "Jan 29, 2025",
    views: "23.7K",
    likes: 97,
    retweets: 5,
    replies: 10,
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Prakash Mardi",
    handle: "@0xKaash",
    verified: false,
    text: "came across @flenthomes and damn, I'm really impressed how well designed and seamless their product is.",
    date: "Jun 28, 2025",
    views: "157",
    likes: 1,
    retweets: 0,
    replies: 1,
    avatar: "/placeholder-user.jpg",
  },
]

function MarqueeTrack({ children, direction = "left", speed = 30 }: { children: React.ReactNode; direction?: "left" | "right"; speed?: number }) {
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
    <div className="inline-flex h-48 w-80 shrink-0 flex-col rounded-2xl border border-[#E5E0D8] bg-white p-5 shadow-sm">
      <span className="mb-2 font-serif text-3xl leading-none text-flent-orange" aria-hidden="true">
        {"\u201C"}
      </span>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-flent-dark whitespace-normal line-clamp-3">
        {testimonial.quote}
      </p>
      <div className="mt-auto">
        <p className="text-sm font-bold text-flent-dark">{testimonial.name}</p>
        <p className="text-xs text-[#6B6B6B]">{testimonial.role}</p>
      </div>
    </div>
  )
}

function TweetCard({ tweet }: { tweet: typeof tweets[0] }) {
  return (
    <div className="inline-flex h-48 w-80 shrink-0 flex-col rounded-2xl border border-[#E5E0D8] bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#E5E0D8]">
          <Image src={tweet.avatar} alt={tweet.name} width={40} height={40} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-bold text-flent-dark">{tweet.name}</span>
            {tweet.verified && (
              <svg className="h-4 w-4 shrink-0 text-[#1D9BF0]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
            )}
          </div>
          <p className="text-xs text-[#6B6B6B]">{tweet.handle}</p>
        </div>
        <svg className="h-5 w-5 shrink-0 text-[#1D9BF0]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
      <p className="mb-3 flex-1 text-sm leading-relaxed text-flent-dark whitespace-normal line-clamp-2">
        {tweet.text.split("@flenthomes").map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && <span className="text-[#1D9BF0]">@flenthomes</span>}
          </span>
        ))}
      </p>
      <div className="flex items-center gap-4 text-xs text-[#6B6B6B]">
        <span>{tweet.date}</span>
        <span>{tweet.views} Views</span>
      </div>
      <div className="mt-2 flex items-center gap-6 border-t border-[#E5E0D8] pt-2 text-xs text-[#6B6B6B]">
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          {tweet.replies}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          {tweet.retweets}
        </span>
        <span className="flex items-center gap-1 text-red-500">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          {tweet.likes}
        </span>
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="space-y-8">
      <h2 className="px-5 font-serif text-3xl font-bold text-flent-dark lg:px-8 lg:text-4xl">
        What residents say
      </h2>

      {/* Testimonials marquee */}
      <MarqueeTrack direction="left">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </MarqueeTrack>

      {/* Twitter social proof marquee */}
      <div className="pt-4">
        <h2 className="mb-4 px-5 font-serif text-3xl font-bold text-flent-dark lg:px-8 lg:text-4xl">
          What people are saying on X
        </h2>
        <MarqueeTrack direction="right">
          {tweets.map((tweet) => (
            <TweetCard key={tweet.handle} tweet={tweet} />
          ))}
        </MarqueeTrack>
      </div>
    </section>
  )
}
