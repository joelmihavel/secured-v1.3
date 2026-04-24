"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Scene({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });

  return (
    <div ref={ref} className={className}>
      <svg viewBox="0 0 280 220" fill="none" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="glow-brand" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF9A6D" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FF9A6D" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-success" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bar-brand" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF9A6D" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FF9A6D" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="bar-neutral" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#656565" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#444444" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="timeline-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4CAF50" />
            <stop offset="100%" stopColor="#FF9A6D" />
          </linearGradient>
        </defs>
        {inView ? children : null}
      </svg>
    </div>
  );
}

const fade = (d: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, delay: d },
});

const slideUp = (d: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay: d, ease: [0.22, 1, 0.36, 1] as const },
});

const scaleIn = (d: number) => ({
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.45, delay: d, ease: [0.34, 1.56, 0.64, 1] as const },
});

const F = "'Plus Jakarta Sans', var(--font-ui, system-ui, sans-serif)";

/* ─────────────────────── TENANT CARDS ─────────────────────── */

/* ── Cashback: wallet + notification ── */
export function CashbackScene({ className = "" }: { className?: string }) {
  return (
    <Scene className={className}>
      <circle cx="140" cy="120" r="80" fill="url(#glow-brand)" />

      {/* Subtle dot grid */}
      {Array.from({ length: 7 }).map((_, r) =>
        Array.from({ length: 9 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={32 + c * 28} cy={22 + r * 28} r="0.6" fill="#222222" />
        ))
      )}

      {/* Balance card */}
      <motion.g {...slideUp(0)}>
        <rect x="48" y="18" width="184" height="52" rx="12" fill="#1A1A1A" stroke="#222222" strokeWidth="0.7" />
        <motion.text x="64" y="40" fill="#878787" fontSize="8" fontFamily={F} fontWeight="500" letterSpacing="0.08em" {...fade(0.15)}>WALLET BALANCE</motion.text>
        <motion.text x="64" y="58" fill="#EEEEEE" fontSize="18" fontFamily={F} fontWeight="700" letterSpacing="-0.03em" {...fade(0.25)}>₹2,450</motion.text>
        <motion.g {...scaleIn(0.4)}>
          <rect x="152" y="31" width="38" height="18" rx="9" fill="#4CAF50" fillOpacity="0.1" />
          <text x="171" y="43" textAnchor="middle" fill="#4CAF50" fontSize="8" fontFamily={F} fontWeight="600">+12%</text>
        </motion.g>
      </motion.g>

      {/* Notification card */}
      <motion.g
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect x="48" y="80" width="184" height="62" rx="12" fill="#1A1A1A" stroke="#FF9A6D" strokeWidth="0.5" strokeOpacity="0.3" />
        <circle cx="72" cy="104" r="12" fill="#FF9A6D" fillOpacity="0.08" />
        <motion.path d="M68 104L71 107L77 100" stroke="#FF9A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.9 }} />
        <motion.text x="90" y="99" fill="#A9A9A9" fontSize="8" fontFamily={F} fontWeight="500" {...fade(0.7)}>Cashback received</motion.text>
        <motion.text x="90" y="115" fill="#FF9A6D" fontSize="15" fontFamily={F} fontWeight="700" letterSpacing="-0.02em" {...fade(0.8)}>+ ₹250</motion.text>
        <motion.text x="220" y="133" textAnchor="end" fill="#444444" fontSize="7" fontFamily={F} {...fade(0.9)}>just now</motion.text>
      </motion.g>

      {/* Previous entry */}
      <motion.g {...slideUp(0.7)}>
        <rect x="48" y="150" width="184" height="42" rx="10" fill="#131313" stroke="#222222" strokeWidth="0.5" />
        <circle cx="70" cy="168" r="8" fill="#202020" />
        <text x="70" y="171" textAnchor="middle" fill="#656565" fontSize="8" fontWeight="500">↑</text>
        <text x="84" y="165" fill="#656565" fontSize="7.5" fontFamily={F} fontWeight="500">Previous cashback</text>
        <text x="84" y="178" fill="#878787" fontSize="10" fontFamily={F} fontWeight="600">+ ₹250</text>
        <text x="220" y="178" textAnchor="end" fill="#444444" fontSize="7" fontFamily={F}>1 month ago</text>
      </motion.g>

      {/* Floating particles */}
      <motion.circle cx="238" cy="38" r="3" fill="#FF9A6D" fillOpacity="0.15"
        animate={{ y: [0, -6, 0], opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} />
      <motion.circle cx="40" cy="78" r="2" fill="#FF9A6D" fillOpacity="0.1"
        animate={{ y: [0, -4, 0], opacity: [0.1, 0.35, 0.1] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 2 }} />
    </Scene>
  );
}

/* ── Rent Insights: comparison bars ── */
export function ShieldScene({ className = "" }: { className?: string }) {
  return (
    <Scene className={className}>
      <circle cx="140" cy="130" r="70" fill="url(#glow-brand)" />

      {/* Header */}
      <motion.text x="40" y="30" fill="#656565" fontSize="8.5" fontFamily={F} fontWeight="500" letterSpacing="0.08em" {...fade(0.05)}>RENT COMPARISON</motion.text>
      <motion.line x1="40" y1="38" x2="240" y2="38" stroke="#222222" strokeWidth="0.5" {...fade(0.1)} />

      {/* Your rent */}
      <motion.text x="40" y="62" fill="#D2D2D2" fontSize="9.5" fontFamily={F} fontWeight="600" {...fade(0.15)}>Your rent</motion.text>
      <rect x="40" y="68" width="200" height="22" rx="5" fill="#1A1A1A" />
      <motion.rect x="40" y="68" width="0" height="22" rx="5" fill="url(#bar-brand)"
        animate={{ width: 168 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
      <motion.text x="215" y="84" fill="#FF9A6D" fontSize="12" fontFamily={F} fontWeight="700" {...fade(0.8)}>₹25K</motion.text>

      {/* Area average */}
      <motion.text x="40" y="112" fill="#D2D2D2" fontSize="9.5" fontFamily={F} fontWeight="600" {...fade(0.25)}>Area average</motion.text>
      <rect x="40" y="118" width="200" height="22" rx="5" fill="#1A1A1A" />
      <motion.rect x="40" y="118" width="0" height="22" rx="5" fill="url(#bar-neutral)"
        animate={{ width: 130 }} transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} />
      <motion.text x="177" y="134" fill="#A9A9A9" fontSize="12" fontFamily={F} fontWeight="600" {...fade(1)}>₹22K</motion.text>

      {/* Insight badge */}
      <motion.g {...scaleIn(1.1)}>
        <rect x="40" y="158" width="114" height="26" rx="13" fill="#FF9A6D" fillOpacity="0.06" stroke="#FF9A6D" strokeWidth="0.5" strokeOpacity="0.2" />
        <circle cx="57" cy="171" r="5" fill="#FF9A6D" fillOpacity="0.15" />
        <text x="57" y="174" textAnchor="middle" fill="#FF9A6D" fontSize="7" fontWeight="700">↑</text>
        <text x="68" y="174" fill="#FF9A6D" fontSize="8.5" fontFamily={F} fontWeight="600">12% above avg</text>
      </motion.g>
    </Scene>
  );
}

/* ── Renter Profile ── */
export function BadgeScene({ className = "" }: { className?: string }) {
  return (
    <Scene className={className}>
      <circle cx="140" cy="65" r="55" fill="url(#glow-brand)" />

      {/* Avatar */}
      <motion.circle cx="140" cy="50" r="24" fill="#1A1A1A" stroke="#222222" strokeWidth="0.8" {...fade(0.1)} />
      <motion.circle cx="140" cy="44" r="8" fill="#2A2A2A" {...fade(0.2)} />
      <motion.path d="M127 63C127 56 133 52 140 52C147 52 153 56 153 63" fill="#2A2A2A" {...fade(0.2)} />

      {/* Verified */}
      <motion.g {...scaleIn(0.6)}>
        <circle cx="158" cy="32" r="8" fill="#FF9A6D" />
        <path d="M155 32L157 34.5L162 29.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>

      {/* Name */}
      <motion.text x="140" y="94" textAnchor="middle" fill="#EEEEEE" fontSize="12" fontFamily={F} fontWeight="700" {...fade(0.3)}>Ananya Sharma</motion.text>
      <motion.text x="140" y="108" textAnchor="middle" fill="#656565" fontSize="8" fontFamily={F} fontWeight="500" {...fade(0.4)}>Tenant since Jan 2024</motion.text>

      {/* Trust score */}
      <motion.g {...slideUp(0.5)}>
        <text x="42" y="134" fill="#878787" fontSize="8.5" fontFamily={F} fontWeight="500">Trust Score</text>
        <text x="238" y="134" textAnchor="end" fill="#FF9A6D" fontSize="10.5" fontFamily={F} fontWeight="700">92<tspan fill="#656565">/100</tspan></text>
      </motion.g>
      <rect x="42" y="140" width="196" height="5" rx="2.5" fill="#1A1A1A" />
      <motion.rect x="42" y="140" width="0" height="5" rx="2.5" fill="#FF9A6D"
        animate={{ width: 180 }} transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} />

      {/* Stats */}
      <motion.g {...slideUp(0.9)}>
        <rect x="32" y="158" width="68" height="40" rx="10" fill="#1A1A1A" stroke="#222222" strokeWidth="0.5" />
        <text x="66" y="175" textAnchor="middle" fill="#DDDDDD" fontSize="12" fontFamily={F} fontWeight="700">12</text>
        <text x="66" y="189" textAnchor="middle" fill="#4D4D4D" fontSize="7.5" fontFamily={F} fontWeight="500">months</text>
      </motion.g>
      <motion.g {...slideUp(1)}>
        <rect x="106" y="158" width="68" height="40" rx="10" fill="#1A1A1A" stroke="#222222" strokeWidth="0.5" />
        <text x="140" y="175" textAnchor="middle" fill="#4CAF50" fontSize="12" fontFamily={F} fontWeight="700">100%</text>
        <text x="140" y="189" textAnchor="middle" fill="#4D4D4D" fontSize="7.5" fontFamily={F} fontWeight="500">on-time</text>
      </motion.g>
      <motion.g {...slideUp(1.1)}>
        <rect x="180" y="158" width="68" height="40" rx="10" fill="#1A1A1A" stroke="#222222" strokeWidth="0.5" />
        <text x="214" y="175" textAnchor="middle" fill="#DDDDDD" fontSize="12" fontFamily={F} fontWeight="700">A+</text>
        <text x="214" y="189" textAnchor="middle" fill="#4D4D4D" fontSize="7.5" fontFamily={F} fontWeight="500">rating</text>
      </motion.g>
    </Scene>
  );
}

/* ── Better Homes: property listing ── */
export function HouseScene({ className = "" }: { className?: string }) {
  return (
    <Scene className={className}>
      {/* Image area */}
      <motion.rect x="32" y="12" width="216" height="90" rx="12" fill="#1A1A1A" stroke="#222222" strokeWidth="0.5" {...fade(0)} />
      <motion.path d="M100 72L118 46L138 62L152 48L178 72" stroke="#2A2A2A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...fade(0.15)} />
      <motion.circle cx="82" cy="42" r="8" fill="#202020" {...fade(0.1)} />
      <motion.circle cx="82" cy="42" r="3" fill="#2A2A2A" {...fade(0.15)} />

      {/* Premium badge */}
      <motion.g {...scaleIn(0.35)}>
        <rect x="40" y="20" width="64" height="20" rx="6" fill="#FF9A6D" />
        <text x="72" y="33" textAnchor="middle" fill="#fff" fontSize="8.5" fontFamily={F} fontWeight="700">★ Premium</text>
      </motion.g>

      {/* Heart */}
      <motion.g {...scaleIn(0.45)}>
        <circle cx="228" cy="28" r="12" fill="#1A1A1A" stroke="#222222" strokeWidth="0.5" />
        <path d="M224 27C224 25 226 23 228 25C230 23 232 25 232 27C232 30 228 32 228 32C228 32 224 30 224 27Z" fill="#FF9A6D" fillOpacity="0.45" />
      </motion.g>

      {/* Info */}
      <motion.text x="40" y="126" fill="#EEEEEE" fontSize="12" fontFamily={F} fontWeight="700" {...fade(0.3)}>Whitefield, 3BHK</motion.text>
      <motion.text x="40" y="140" fill="#656565" fontSize="8.5" fontFamily={F} fontWeight="500" {...fade(0.4)}>Prestige Lakeside Habitat</motion.text>

      {/* Price */}
      <motion.text x="40" y="164" fill="#FF9A6D" fontSize="15" fontFamily={F} fontWeight="700" letterSpacing="-0.02em" {...fade(0.5)}>₹35,000</motion.text>
      <motion.text x="112" y="164" fill="#656565" fontSize="9" fontFamily={F} fontWeight="500" {...fade(0.55)}>/month</motion.text>

      {/* Pills */}
      <motion.g {...slideUp(0.7)}>
        <rect x="40" y="176" width="64" height="21" rx="10.5" fill="#1A1A1A" stroke="#222222" strokeWidth="0.5" />
        <text x="72" y="190" textAnchor="middle" fill="#A9A9A9" fontSize="7.5" fontFamily={F} fontWeight="500">No deposit</text>
      </motion.g>
      <motion.g {...slideUp(0.8)}>
        <rect x="110" y="176" width="58" height="21" rx="10.5" fill="#1A1A1A" stroke="#222222" strokeWidth="0.5" />
        <text x="139" y="190" textAnchor="middle" fill="#A9A9A9" fontSize="7.5" fontFamily={F} fontWeight="500">Priority ↑</text>
      </motion.g>
      <motion.g {...slideUp(0.9)}>
        <rect x="174" y="176" width="66" height="21" rx="10.5" fill="#FF9A6D" fillOpacity="0.06" stroke="#FF9A6D" strokeWidth="0.4" strokeOpacity="0.2" />
        <text x="207" y="190" textAnchor="middle" fill="#FF9A6D" fontSize="7.5" fontFamily={F} fontWeight="600">Unlocked</text>
      </motion.g>
    </Scene>
  );
}

/* ─────────────────────── LANDLORD CARDS ─────────────────────── */

/* ── Vacancy Cover: income timeline ── */
export function ShieldHouseScene({ className = "" }: { className?: string }) {
  return (
    <Scene className={className}>
      <circle cx="140" cy="110" r="80" fill="url(#glow-success)" />

      {/* Header */}
      <motion.text x="35" y="26" fill="#656565" fontSize="8.5" fontFamily={F} fontWeight="500" letterSpacing="0.08em" {...fade(0.05)}>RENTAL INCOME</motion.text>
      <motion.text x="245" y="26" textAnchor="end" fill="#4CAF50" fontSize="8.5" fontFamily={F} fontWeight="600" {...fade(0.1)}>₹1.2L this quarter</motion.text>
      <motion.line x1="35" y1="34" x2="245" y2="34" stroke="#222222" strokeWidth="0.5" {...fade(0.1)} />

      {/* Month rows */}
      {[
        { month: "Jan", amount: "₹30,000", status: "Paid", color: "#4CAF50" },
        { month: "Feb", amount: "₹30,000", status: "Paid", color: "#4CAF50" },
        { month: "Mar", amount: "₹30,000", status: "Covered", color: "#FF9A6D" },
        { month: "Apr", amount: "₹30,000", status: "Paid", color: "#4CAF50" },
      ].map((row, i) => (
        <motion.g key={i} {...slideUp(0.15 + i * 0.1)}>
          <rect x="35" y={42 + i * 38} width="210" height="32" rx="8"
            fill={row.status === "Covered" ? "#FF9A6D04" : "#131313"}
            stroke={row.status === "Covered" ? "#FF9A6D18" : "#222222"}
            strokeWidth="0.5" />

          <motion.g {...scaleIn(0.3 + i * 0.1)}>
            <circle cx="52" cy={58 + i * 38} r="5" fill={row.color} fillOpacity="0.1" />
            <circle cx="52" cy={58 + i * 38} r="2.5" fill={row.color} />
          </motion.g>

          <text x="64" y={62 + i * 38} fill="#CBCBCB" fontSize="10" fontFamily={F} fontWeight="600">{row.month}</text>
          <text x="185" y={62 + i * 38} textAnchor="end" fill="#DDDDDD" fontSize="11" fontFamily={F} fontWeight="600">{row.amount}</text>

          <rect x="192" y={50 + i * 38} width={row.status === "Covered" ? 52 : 38} height="17" rx="4"
            fill={row.color} fillOpacity="0.08" />
          <text x={row.status === "Covered" ? 218 : 211} y={62 + i * 38} textAnchor="middle"
            fill={row.color} fontSize="7.5" fontFamily={F} fontWeight="600">{row.status}</text>
        </motion.g>
      ))}

      {/* Summary */}
      <motion.g {...slideUp(0.7)}>
        <line x1="35" y1="200" x2="245" y2="200" stroke="#222222" strokeWidth="0.5" />
        <text x="35" y="214" fill="#656565" fontSize="8" fontFamily={F} fontWeight="500">No income lost</text>
        <text x="245" y="214" textAnchor="end" fill="#4CAF50" fontSize="8" fontFamily={F} fontWeight="600">100% covered ✓</text>
      </motion.g>
    </Scene>
  );
}

/* ── Exit Protection ── */
export function DoorScene({ className = "" }: { className?: string }) {
  return (
    <Scene className={className}>
      <circle cx="140" cy="85" r="70" fill="url(#glow-brand)" />

      {/* Dot grid */}
      {Array.from({ length: 7 }).map((_, r) =>
        Array.from({ length: 9 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={32 + c * 28} cy={22 + r * 28} r="0.6" fill="#222222" />
        ))
      )}

      {/* Alert card */}
      <motion.g
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <rect x="35" y="18" width="210" height="72" rx="12" fill="#1A1A1A" stroke="#FF9A6D" strokeWidth="0.5" strokeOpacity="0.25" />

        <circle cx="58" cy="46" r="14" fill="#FF9A6D" fillOpacity="0.08" />
        <motion.text x="58" y="51" textAnchor="middle" fill="#FF9A6D" fontSize="14" fontWeight="700"
          animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>!</motion.text>

        <motion.text x="80" y="40" fill="#EEEEEE" fontSize="10" fontFamily={F} fontWeight="700" {...fade(0.4)}>Tenant exit notice</motion.text>
        <motion.text x="80" y="54" fill="#878787" fontSize="8" fontFamily={F} fontWeight="500" {...fade(0.5)}>Protection automatically activated</motion.text>

        <motion.g {...scaleIn(0.7)}>
          <circle cx="228" cy="73" r="8" fill="#FF9A6D" fillOpacity="0.1" />
          <path d="M225 73L227 75.5L231 70.5" stroke="#FF9A6D" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>

        <motion.text x="80" y="75" fill="#656565" fontSize="7.5" fontFamily={F} fontWeight="500" {...fade(0.6)}>Payout continues for 45 days</motion.text>
      </motion.g>

      {/* Payment cards */}
      <motion.g {...slideUp(0.7)}>
        <rect x="35" y="100" width="210" height="46" rx="10" fill="#131313" stroke="#222222" strokeWidth="0.5" />
        <text x="50" y="118" fill="#878787" fontSize="8" fontFamily={F} fontWeight="500">Next payout</text>
        <text x="50" y="136" fill="#4CAF50" fontSize="14" fontFamily={F} fontWeight="700">₹30,000</text>
        <text x="232" y="136" textAnchor="end" fill="#4D4D4D" fontSize="8" fontFamily={F} fontWeight="500">Apr 1, 2026</text>
      </motion.g>

      <motion.g {...slideUp(0.9)}>
        <rect x="35" y="154" width="210" height="46" rx="10" fill="#131313" stroke="#222222" strokeWidth="0.5" />
        <text x="50" y="172" fill="#878787" fontSize="8" fontFamily={F} fontWeight="500">Following payout</text>
        <text x="50" y="190" fill="#4CAF50" fontSize="14" fontFamily={F} fontWeight="700">₹30,000</text>
        <text x="232" y="190" textAnchor="end" fill="#4D4D4D" fontSize="8" fontFamily={F} fontWeight="500">May 1, 2026</text>
      </motion.g>
    </Scene>
  );
}

/* ── Verification: checklist ── */
export function SealCheckScene({ className = "" }: { className?: string }) {
  return (
    <Scene className={className}>
      <circle cx="140" cy="110" r="70" fill="url(#glow-success)" />

      <motion.text x="35" y="26" fill="#656565" fontSize="8.5" fontFamily={F} fontWeight="500" letterSpacing="0.08em" {...fade(0.05)}>TENANT VERIFICATION</motion.text>
      <motion.line x1="35" y1="34" x2="245" y2="34" stroke="#222222" strokeWidth="0.5" {...fade(0.1)} />

      {[
        { label: "Identity verified", sub: "Aadhaar + PAN matched" },
        { label: "Employment confirmed", sub: "Salary slip verified" },
        { label: "Rental history", sub: "3 years, clean record" },
        { label: "Background clear", sub: "No flags found" },
      ].map((item, i) => (
        <motion.g key={i} {...slideUp(0.18 + i * 0.1)}>
          <rect x="35" y={42 + i * 38} width="210" height="32" rx="8" fill="#131313" stroke="#222222" strokeWidth="0.5" />

          <motion.g {...scaleIn(0.35 + i * 0.1)}>
            <circle cx="54" cy={58 + i * 38} r="8" fill="#4CAF50" fillOpacity="0.08" />
            <motion.path
              d={`M50 ${58 + i * 38}L53 ${61 + i * 38}L58 ${54 + i * 38}`}
              stroke="#4CAF50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, delay: 0.45 + i * 0.13 }}
            />
          </motion.g>

          <text x="70" y={55 + i * 38} fill="#DDDDDD" fontSize="9.5" fontFamily={F} fontWeight="600">{item.label}</text>
          <text x="70" y={66 + i * 38} fill="#4D4D4D" fontSize="7" fontFamily={F} fontWeight="500">{item.sub}</text>
        </motion.g>
      ))}

      <motion.g {...scaleIn(1)}>
        <rect x="35" y="198" width="70" height="22" rx="11" fill="#FF9A6D" fillOpacity="0.06" stroke="#FF9A6D" strokeWidth="0.4" strokeOpacity="0.2" />
        <text x="70" y="212" textAnchor="middle" fill="#FF9A6D" fontSize="9" fontFamily={F} fontWeight="600">₹0 cost</text>
      </motion.g>
      <motion.text x="115" y="212" fill="#4D4D4D" fontSize="8" fontFamily={F} fontWeight="500" {...fade(1.1)}>Included with Secured</motion.text>
    </Scene>
  );
}

/* ── Growth/Control: dashboard ── */
export function ChartScene({ className = "" }: { className?: string }) {
  return (
    <Scene className={className}>
      <circle cx="140" cy="85" r="70" fill="url(#glow-brand)" />

      <motion.text x="35" y="26" fill="#656565" fontSize="8.5" fontFamily={F} fontWeight="500" letterSpacing="0.08em" {...fade(0.05)}>INCOME DASHBOARD</motion.text>
      <motion.line x1="35" y1="34" x2="245" y2="34" stroke="#222222" strokeWidth="0.5" {...fade(0.1)} />

      {/* Total */}
      <motion.text x="35" y="58" fill="#EEEEEE" fontSize="22" fontFamily={F} fontWeight="800" letterSpacing="-0.03em" {...fade(0.15)}>₹3.6L</motion.text>
      <motion.g {...scaleIn(0.3)}>
        <rect x="112" y="42" width="40" height="18" rx="9" fill="#4CAF50" fillOpacity="0.08" />
        <text x="132" y="54" textAnchor="middle" fill="#4CAF50" fontSize="8.5" fontFamily={F} fontWeight="700">↑ 18%</text>
      </motion.g>
      <motion.text x="35" y="70" fill="#656565" fontSize="8" fontFamily={F} fontWeight="500" {...fade(0.25)}>Total this quarter</motion.text>

      {/* Bar chart */}
      {[
        { h: 32, label: "Jan" },
        { h: 40, label: "Feb" },
        { h: 30, label: "Mar" },
        { h: 48, label: "Apr" },
        { h: 44, label: "May" },
        { h: 55, label: "Jun" },
      ].map((bar, i) => (
        <motion.g key={i}>
          <motion.rect
            x={42 + i * 35} y={145 - bar.h} width="22" height={bar.h} rx="4"
            fill={i === 5 ? "#FF9A6D" : "#222222"}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            transition={{ duration: 0.55, delay: 0.3 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${53 + i * 35}px 145px` }}
          />
          <motion.text x={53 + i * 35} y="158" textAnchor="middle" fill="#4D4D4D" fontSize="7" fontFamily={F} fontWeight="500" {...fade(0.5 + i * 0.04)}>{bar.label}</motion.text>
        </motion.g>
      ))}

      {/* Stats */}
      <motion.g {...slideUp(0.85)}>
        <rect x="35" y="168" width="102" height="36" rx="8" fill="#131313" stroke="#222222" strokeWidth="0.5" />
        <text x="48" y="184" fill="#878787" fontSize="7.5" fontFamily={F} fontWeight="500">Tenants</text>
        <text x="48" y="197" fill="#EEEEEE" fontSize="11" fontFamily={F} fontWeight="700">3 active</text>
      </motion.g>
      <motion.g {...slideUp(0.95)}>
        <rect x="143" y="168" width="102" height="36" rx="8" fill="#131313" stroke="#222222" strokeWidth="0.5" />
        <text x="156" y="184" fill="#878787" fontSize="7.5" fontFamily={F} fontWeight="500">Collection rate</text>
        <text x="156" y="197" fill="#4CAF50" fontSize="11" fontFamily={F} fontWeight="700">100%</text>
      </motion.g>
    </Scene>
  );
}

/* ── Quick setup ── */
export function LightningScene({ className = "" }: { className?: string }) {
  return (
    <Scene className={className}>
      <circle cx="140" cy="100" r="60" fill="url(#glow-brand)" />

      <motion.text x="35" y="26" fill="#656565" fontSize="8.5" fontFamily={F} fontWeight="500" letterSpacing="0.08em" {...fade(0.05)}>QUICK SETUP</motion.text>

      {/* Progress */}
      <motion.g {...fade(0.1)}>
        <rect x="35" y="36" width="210" height="4" rx="2" fill="#1A1A1A" />
        <motion.rect x="35" y="36" width="0" height="4" rx="2" fill="#FF9A6D"
          animate={{ width: 155 }} transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} />
        <motion.text x="245" y="42" textAnchor="end" fill="#FF9A6D" fontSize="8" fontFamily={F} fontWeight="600" {...fade(0.5)}>75%</motion.text>
      </motion.g>

      {/* Steps */}
      {[
        { label: "Add bank account", sub: "HDFC ••4521 linked", done: true },
        { label: "Link rent amount", sub: "₹25,000/month set", done: true },
        { label: "Set up autopay", sub: "Tap to configure", done: false },
      ].map((step, i) => (
        <motion.g key={i} {...slideUp(0.25 + i * 0.1)}>
          <rect x="35" y={52 + i * 50} width="210" height="42" rx="10"
            fill={step.done ? "#131313" : "#1A1A1A"}
            stroke={step.done ? "#4CAF5018" : "#FF9A6D18"}
            strokeWidth="0.5" />

          <motion.g {...scaleIn(0.4 + i * 0.1)}>
            <circle cx="56" cy={73 + i * 50} r="8" fill={step.done ? "#4CAF50" : "#FF9A6D"} fillOpacity="0.08" />
            {step.done ? (
              <motion.path d={`M52 ${73 + i * 50}L55 ${76 + i * 50}L60 ${69 + i * 50}`}
                stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.55 + i * 0.1 }} />
            ) : (
              <motion.circle cx="56" cy={73 + i * 50} r="3" fill="#FF9A6D" fillOpacity="0.35"
                animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
            )}
          </motion.g>

          <text x="72" y={70 + i * 50} fill={step.done ? "#D2D2D2" : "#EEEEEE"} fontSize="9.5" fontFamily={F} fontWeight="600">{step.label}</text>
          <text x="72" y={82 + i * 50} fill={step.done ? "#4D4D4D" : "#878787"} fontSize="7.5" fontFamily={F} fontWeight="500">{step.sub}</text>
        </motion.g>
      ))}

      {/* Time badge */}
      <motion.g {...scaleIn(0.8)}>
        <rect x="35" y="208" width="126" height="22" rx="11" fill="#FF9A6D" fillOpacity="0.06" stroke="#FF9A6D" strokeWidth="0.4" strokeOpacity="0.2" />
        <text x="98" y="222" textAnchor="middle" fill="#FF9A6D" fontSize="8.5" fontFamily={F} fontWeight="600">⚡ Takes under 2 min</text>
      </motion.g>
    </Scene>
  );
}

/* ── Credit Card: payment + points ── */
export function CreditCardScene({ className = "" }: { className?: string }) {
  return (
    <Scene className={className}>
      {/* Card */}
      <motion.g {...slideUp(0)}>
        <rect x="38" y="16" width="204" height="105" rx="12" fill="#1A1A1A" stroke="#222222" strokeWidth="0.6" />
        <rect x="38" y="16" width="204" height="105" rx="12" fill="url(#glow-brand)" />

        {/* Chip */}
        <motion.rect x="56" y="46" width="28" height="20" rx="4" fill="#444444" stroke="#4D4D4D" strokeWidth="0.5" {...fade(0.2)} />
        <line x1="56" y1="56" x2="84" y2="56" stroke="#4D4D4D" strokeWidth="0.3" />
        <line x1="70" y1="46" x2="70" y2="66" stroke="#4D4D4D" strokeWidth="0.3" />

        {/* Number dots */}
        {[0, 1, 2, 3].map(g => (
          <motion.g key={g} {...fade(0.3 + g * 0.04)}>
            {[0, 1, 2, 3].map(d => (
              <circle key={d} cx={58 + g * 38 + d * 7} cy="86" r="2" fill={g === 3 ? "#A9A9A9" : "#4D4D4D"} />
            ))}
          </motion.g>
        ))}

        <motion.text x="56" y="108" fill="#656565" fontSize="7.5" fontFamily={F} fontWeight="600" letterSpacing="0.05em" {...fade(0.5)}>RENT PAYMENT</motion.text>
        <motion.text x="224" y="108" textAnchor="end" fill="#878787" fontSize="7.5" fontFamily={F} fontWeight="500" {...fade(0.5)}>VISA</motion.text>
      </motion.g>

      {/* Points notification */}
      <motion.g
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect x="38" y="131" width="204" height="58" rx="12" fill="#1A1A1A" stroke="#FF9A6D" strokeWidth="0.4" strokeOpacity="0.25" />
        <circle cx="62" cy="155" r="12" fill="#FF9A6D" fillOpacity="0.08" />
        <text x="62" y="159" textAnchor="middle" fill="#FF9A6D" fontSize="12">★</text>
        <motion.text x="82" y="150" fill="#D2D2D2" fontSize="9" fontFamily={F} fontWeight="600" {...fade(0.75)}>Points earned this month</motion.text>
        <motion.text x="82" y="168" fill="#FF9A6D" fontSize="16" fontFamily={F} fontWeight="700" letterSpacing="-0.02em" {...fade(0.85)}>+2,450</motion.text>
      </motion.g>
    </Scene>
  );
}

/* ── Breathing room timeline ── */
export function HourglassScene({ className = "" }: { className?: string }) {
  return (
    <Scene className={className}>
      <circle cx="140" cy="80" r="60" fill="url(#glow-brand)" />

      <motion.text x="35" y="26" fill="#656565" fontSize="8.5" fontFamily={F} fontWeight="500" letterSpacing="0.08em" {...fade(0.05)}>PAYMENT TIMELINE</motion.text>
      <motion.line x1="35" y1="34" x2="245" y2="34" stroke="#222222" strokeWidth="0.5" {...fade(0.1)} />

      {/* Big number */}
      <motion.text x="140" y="80" textAnchor="middle" fill="#EEEEEE" fontSize="38" fontFamily={F} fontWeight="800" letterSpacing="-0.04em" {...fade(0.2)}>45</motion.text>
      <motion.text x="140" y="98" textAnchor="middle" fill="#878787" fontSize="10" fontFamily={F} fontWeight="500" {...fade(0.3)}>days breathing room</motion.text>

      {/* Timeline bar */}
      <rect x="35" y="116" width="210" height="6" rx="3" fill="#1A1A1A" />
      <motion.rect x="35" y="116" width="0" height="6" rx="3" fill="url(#timeline-grad)"
        animate={{ width: 210 }} transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} />
      <motion.circle cx="35" cy="119" r="4" fill="#4CAF50" stroke="#0D0D0D" strokeWidth="2"
        animate={{ cx: [35, 245] }} transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} />

      {/* Labels */}
      <motion.text x="35" y="140" fill="#4CAF50" fontSize="8" fontFamily={F} fontWeight="600" {...fade(0.6)}>Rent paid</motion.text>
      <motion.text x="245" y="140" textAnchor="end" fill="#FF9A6D" fontSize="8" fontFamily={F} fontWeight="600" {...fade(0.6)}>Due date</motion.text>

      {/* Date cards */}
      <motion.g {...slideUp(0.8)}>
        <rect x="35" y="153" width="102" height="42" rx="10" fill="#131313" stroke="#222222" strokeWidth="0.5" />
        <text x="48" y="170" fill="#878787" fontSize="7.5" fontFamily={F} fontWeight="500">Paid on</text>
        <text x="48" y="186" fill="#DDDDDD" fontSize="11" fontFamily={F} fontWeight="600">Mar 1, 2026</text>
      </motion.g>
      <motion.g {...slideUp(0.9)}>
        <rect x="143" y="153" width="102" height="42" rx="10" fill="#131313" stroke="#222222" strokeWidth="0.5" />
        <text x="156" y="170" fill="#878787" fontSize="7.5" fontFamily={F} fontWeight="500">Due by</text>
        <text x="156" y="186" fill="#DDDDDD" fontSize="11" fontFamily={F} fontWeight="600">Apr 15, 2026</text>
      </motion.g>
    </Scene>
  );
}

/* ── Low Fees: comparison ── */
export function ReceiptScene({ className = "" }: { className?: string }) {
  return (
    <Scene className={className}>
      {/* Headers */}
      <motion.text x="95" y="22" textAnchor="middle" fill="#878787" fontSize="9" fontFamily={F} fontWeight="600" {...fade(0.05)}>Others</motion.text>
      <motion.text x="210" y="22" textAnchor="middle" fill="#FF9A6D" fontSize="9" fontFamily={F} fontWeight="700" {...fade(0.05)}>Secured</motion.text>

      <line x1="148" y1="8" x2="148" y2="188" stroke="#222222" strokeWidth="0.5" />
      <motion.line x1="28" y1="30" x2="260" y2="30" stroke="#222222" strokeWidth="0.5" {...fade(0.1)} />

      {/* Fee rows */}
      {[
        { label: "Platform fee", others: "2.5%", secured: "1.5%" },
        { label: "Processing fee", others: "1.2%", secured: "0%" },
        { label: "Convenience fee", others: "₹99", secured: "₹0" },
      ].map((row, i) => (
        <motion.g key={i} {...slideUp(0.15 + i * 0.1)}>
          <text x="36" y={54 + i * 50} fill="#656565" fontSize="8" fontFamily={F} fontWeight="500">{row.label}</text>
          <text x="36" y={70 + i * 50} fill="#A9A9A9" fontSize="13" fontFamily={F} fontWeight="500">{row.others}</text>
          <motion.line
            x1="36" y1={67 + i * 50} x2={36 + row.others.length * 8} y2={67 + i * 50}
            stroke="#E5484D" strokeWidth="1.2" strokeOpacity="0.5"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.35, delay: 0.5 + i * 0.1 }}
            style={{ transformOrigin: "left" }}
          />

          <text x="158" y={54 + i * 50} fill="#656565" fontSize="8" fontFamily={F} fontWeight="500">{row.label}</text>
          <text x="158" y={70 + i * 50} fill="#EEEEEE" fontSize="13" fontFamily={F} fontWeight="700">{row.secured}</text>

          {i < 2 && <line x1="28" y1={82 + i * 50} x2="260" y2={82 + i * 50} stroke="#1A1A1A" strokeWidth="0.5" />}
        </motion.g>
      ))}

      {/* Save badge */}
      <motion.g {...scaleIn(0.85)}>
        <rect x="153" y="190" width="108" height="24" rx="12" fill="#FF9A6D" fillOpacity="0.06" stroke="#FF9A6D" strokeWidth="0.5" strokeOpacity="0.2" />
        <text x="207" y="206" textAnchor="middle" fill="#FF9A6D" fontSize="9" fontFamily={F} fontWeight="700">Save up to 40%</text>
      </motion.g>
    </Scene>
  );
}

export const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
  cashback: CashbackScene,
  "zero-deposit": ShieldScene,
  "better-homes": HouseScene,
  "renter-profile": BadgeScene,
  "vacancy-cover": ShieldHouseScene,
  "tenant-exit": DoorScene,
  verification: SealCheckScene,
  growth: ChartScene,
  "setup-fast": LightningScene,
  "card-points": CreditCardScene,
  "breathing-room": HourglassScene,
  "low-fees": ReceiptScene,
};
