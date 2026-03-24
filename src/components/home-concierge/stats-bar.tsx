const stats = [
  { number: "200+", label: "Homes across Bangalore" },
  { number: "58", label: "Quality checks per home" },
  { number: "₹5L+", label: "Invested per home in design & setup" },
]

export function StatsBar() {
  return (
    <section className="animate-fade-up-delay-3">
      <div className="grid grid-cols-1 divide-y divide-[#E5E0D8] overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white shadow-sm md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="px-6 py-6 text-center lg:px-8 lg:py-8">
            <p className="font-serif text-3xl font-bold text-flent-green lg:text-4xl">
              {stat.number}
            </p>
            <p className="mt-1.5 text-sm font-medium text-[#6B6B6B]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
