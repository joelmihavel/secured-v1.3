type CtaSectionProps = {
  area: string;
};

export function CtaSection({ area }: CtaSectionProps) {
  return (
    <section className="py-7 text-center">
      <a
        href="https://www.flent.in/homes"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-forest-green px-8 py-3.5 text-sm font-extrabold text-bg-white shadow-[0_4px_16px_color-mix(in_srgb,var(--color-forest-green)_25%,transparent)] transition hover:-translate-y-0.5"
      >
        Browse Flent Homes in {area}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
      <p className="mt-2.5 text-xs text-muted-foreground">
        No commitment. Book a visit and see for yourself.
      </p>
    </section>
  );
}
