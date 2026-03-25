const stats = [
  { number: "200+", label: "Homes across Bangalore" },
  { number: "58", label: "Quality checks per home" },
  { number: "\u20B95L+", label: "Invested per home in design & setup" },
]

export function StatsBar() {
  return (
    <section className="animate-fade-up-delay-3">
      <div className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-4 text-center lg:px-8 lg:py-8">
            <p className="font-serif text-3xl font-bold text-flent-green lg:text-5xl">
              {stat.number}
            </p>
            <p className="mt-1 text-xs font-medium text-muted-foreground lg:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
