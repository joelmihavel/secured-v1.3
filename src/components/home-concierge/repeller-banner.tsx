export function RepellerBanner() {
  return (
    <section className="overflow-hidden rounded-2xl bg-flent-dark p-8 lg:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
        <p className="shrink-0 font-serif text-7xl font-black italic text-flent-red lg:text-8xl">
          No.
        </p>
        <div>
          <h2 className="mb-3 font-serif text-2xl font-bold text-white lg:text-3xl">
            This isn&apos;t for everyone.
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/70">
            If you&apos;re hunting for the cheapest room in Bangalore, we&apos;re not it.
            Flent is for folks who value design, luxury, and convenience — and are willing
            to invest in how they live. Our homes start at ₹25,000/month per room. No
            exceptions, no haggling.
          </p>
        </div>
      </div>
    </section>
  )
}
