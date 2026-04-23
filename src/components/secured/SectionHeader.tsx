"use client";

export function SectionHeader({
  label,
  index,
  total,
}: {
  label: string;
  index: number;
  total: number;
}) {
  return (
    <div
      className="sticky z-[25] mx-auto flex h-10 max-w-[1200px] items-center justify-between border-x border-b border-[#282828] bg-[#131313]/90 px-6 backdrop-blur-sm md:h-12 xl:max-w-[1320px]"
      style={{ top: 0 }}
    >
      <span
        className="text-[10px] uppercase tracking-[0.12em] text-[#666] md:text-xs"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {label}
      </span>
      <span
        className="text-[10px] tracking-[0.08em] text-[#555] md:text-xs"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        <span className="text-[#ff9a6d]">{index}</span>
        <span className="mx-0.5">/</span>
        {total}
      </span>
    </div>
  );
}
