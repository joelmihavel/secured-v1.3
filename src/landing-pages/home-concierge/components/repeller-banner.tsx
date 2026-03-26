export function RepellerBanner() {
  return (
    <section className="overflow-hidden rounded-2xl bg-flent-dark p-6 lg:p-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
        {/* Big "No." */}
        <p className="shrink-0 font-serif text-5xl font-black italic text-flent-red lg:text-8xl">
          No.
        </p>

        <div>
          <h2 className="mb-2 font-serif text-xl font-bold text-card lg:mb-3 lg:text-3xl">
            This isn't for everyone.
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-card/70 lg:text-base">
            If you&apos;re hunting for the cheapest room in Bangalore, we&apos;re
            not it. Flent is for folks who value design, luxury, and
            convenience. Our homes start at ₹25,000/month per room.
          </p>
        </div>
      </div>
    </section>
  )
}
