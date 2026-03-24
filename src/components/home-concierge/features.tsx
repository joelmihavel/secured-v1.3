import { Armchair, ChefHat, Wifi, Wrench, BadgeCheck, DoorOpen } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  bgColor: string
  iconColor: string
}

const features: Feature[] = [
  {
    icon: Armchair,
    title: "Fully Furnished",
    description: "Designer beds, wardrobes, desks, curtains — everything you need from day one.",
    bgColor: "bg-flent-pastel-green",
    iconColor: "text-flent-green",
  },
  {
    icon: ChefHat,
    title: "Loaded Kitchen",
    description: "Fridge, microwave, induction, cookware. Cook or order — your call.",
    bgColor: "bg-flent-pastel-orange",
    iconColor: "text-flent-orange",
  },
  {
    icon: Wifi,
    title: "Single POC",
    description: "Dedicated POC for any maintenance / setup you require in a Flent home. You do not have to deal with multiple POCs anymore.",
    bgColor: "bg-flent-pastel-violet",
    iconColor: "text-flent-violet",
  },
  {
    icon: Wrench,
    title: "Zero Maintenance",
    description: "Something breaks? We fix it. Plumbing, electrical, appliances — all on us.",
    bgColor: "bg-flent-pastel-green",
    iconColor: "text-flent-green",
  },
  {
    icon: BadgeCheck,
    title: "No Brokerage",
    description: "No middlemen, no hidden fees. Deal directly with Flent, always.",
    bgColor: "bg-flent-pastel-orange",
    iconColor: "text-flent-orange",
  },
  {
    icon: DoorOpen,
    title: "Easy Move Outs",
    description: "Life changes. One-month notice, simple process, no penalties.",
    bgColor: "bg-flent-pastel-violet",
    iconColor: "text-flent-violet",
  },
]

export function Features() {
  return (
    <section>
      <h2 className="mb-8 font-serif text-3xl font-bold text-flent-dark lg:text-4xl">
        What comes with every door
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-sm"
            >
              <div
                className={`mb-4 flex h-14 w-11 items-center justify-center ${feature.bgColor}`}
                style={{ borderRadius: "999px 999px 6px 6px" }}
              >
                <Icon className={`h-5 w-5 ${feature.iconColor}`} strokeWidth={2.5} />
              </div>
              <h3 className="mb-1.5 text-base font-bold text-flent-dark">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-[#6B6B6B]">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
