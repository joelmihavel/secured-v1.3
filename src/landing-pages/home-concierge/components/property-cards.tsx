"use client"

import Image from "next/image"
import { triggerFormAttention } from "@landing-pages/home-concierge/lib/form-attention"

const properties = [
  {
    name: "Arbour",
    location: "HSR Layout",
    bhk: "2 BHK",
    sqft: "1,200 sqft",
    price: "32,500",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/66dd2d17a528a79d9b79a3dc_66dd2ba38058bad06fc252a1_DSC06965-HDR-pJ11za1rSjeBq1YHNhyfWn4WTzY4xw.webp",
    available: "Available Now",
  },
  {
    name: "Muse",
    location: "Ulsoor",
    bhk: "2 BHK",
    sqft: "1,700 sqft",
    price: "35,000",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/696b3cbfd96293529d90d477_Banner-hyrYOewdhH7EvTJhZvISxFk7p11dqD.avif",
    available: "2 rooms left",
  },
  {
    name: "Carnation",
    location: "Bellandur",
    bhk: "3 BHK",
    sqft: "1,800 sqft",
    price: "28,000",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/699d12d6bb108884319e42c9_6990535687d258b94db0c88d_Banner-kgqFJpUTfMP14UMQZrKyJihJ3z64Iw.webp",
    available: "Available Now",
  },
  {
    name: "Aer",
    location: "Whitefield",
    bhk: "3 BHK",
    sqft: "1,800 sqft",
    price: "30,000",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/680f24661ae144471217a01f_680f20b16cbc9c5939b49c70_Banner-s8nbpMvVvviQfu4s2NkDYpwttAmPOg.avif",
    available: "1 room left",
  },
]

export function PropertyCards() {
  return (
    <section>
      <h2 className="mb-6 font-serif text-3xl font-bold text-flent-dark lg:text-4xl">
        View some of our homes
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {properties.map((property) => (
          <button
            key={property.name}
            type="button"
            onClick={triggerFormAttention}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Arch-shaped image */}
            <div className="relative mx-4 mt-4 overflow-hidden" style={{ borderRadius: "999px 999px 12px 12px" }}>
              <div className="aspect-[4/3]">
                <Image
                  src={property.image}
                  alt={`${property.name} — ${property.location}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {/* Location tag */}
              <span className="absolute bottom-3 left-3 rounded-full bg-flent-dark/70 px-3 py-1 text-xs font-semibold text-card backdrop-blur-sm">
                {property.location}
              </span>
            </div>

            {/* Card body */}
            <div className="px-5 pb-5 pt-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-xl font-bold text-flent-dark">
                  {property.name}
                </h3>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  property.available.includes("left")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {property.available}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>{property.bhk}</span>
                <span aria-hidden="true" className="text-border">{"·"}</span>
                <span>{property.sqft}</span>
              </div>
              <p className="mt-3 text-base font-bold text-flent-dark">
                {"From ₹"}{property.price}{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  /month per room
                </span>
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* View more homes CTA */}
      <button
        type="button"
        onClick={triggerFormAttention}
        className="mt-6 w-full rounded-lg bg-flent-dark px-6 py-4 text-sm font-bold text-card transition-colors hover:bg-flent-dark/90"
      >
        {"View more homes →"}
      </button>
    </section>
  )
}
