const testimonials = [
  {
    quote:
      "Flent has redefined renting for me with no brokers, hefty deposits, or long term commitments. I have seamlessly moved between fully furnished homes with great views and flexible terms, even extending my stay from three months to a year. It suits my dynamic work life perfectly and is now my go to choice for renting.",
    name: "Ayush Tripathi",
    role: "Product Manager, MIQ",
  },
  {
    quote:
      "This cozy property sits on one of Kalyan Nagar's most vibrant streets. The team has been incredibly supportive with all house issues. Originally booked it for 3 months, but I've happily extended my stay to 12 months, thanks to the comfort and convenience it offers.",
    name: "Harshit K",
    role: "Software Engineer, Walmart",
  },
  {
    quote:
      "I booked this house based on the pictures alone and felt a bit unsure at first. However, upon arrival, it was just as pictured. The view from my room's window is lovely, and the living room balcony has become the perfect spot for hangouts and gatherings with friends.",
    name: "Aayush Khazanchi",
    role: "Investment Banking Analyst, JM Financial",
  },
  {
    quote:
      "I've lived here for the past 3 months, enjoying a room with a pool view and great ventilation. The house is tastefully furnished, and I also get to use the building's amenities like the swimming pool, badminton, and basketball courts.",
    name: "Gautam Kakadiya",
    role: "Senior Software Engineer, VerSe",
  },
]

export function Testimonials() {
  return (
    <section>
      <h2 className="mb-8 font-serif text-3xl font-bold text-flent-dark lg:text-4xl">
        What residents say
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-sm"
          >
            <span
              className="mb-3 block font-serif text-5xl leading-none text-flent-orange"
              aria-hidden="true"
            >
              {"\u201C"}
            </span>
            <p className="mb-5 text-sm leading-relaxed text-flent-dark">{testimonial.quote}</p>
            <div>
              <p className="text-sm font-bold text-flent-dark">{testimonial.name}</p>
              <p className="text-xs text-[#6B6B6B]">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
