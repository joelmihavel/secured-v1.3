"use client";

export function FlowingLines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 hidden opacity-50 lg:block"
      aria-hidden="true"
    >
      <div className="mx-auto flex h-full max-w-[1200px] justify-between px-6 xl:max-w-[1320px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative h-full"
            style={{
              width: 1,
              borderLeft: "1px dashed #333",
            }}
          >
            <div
              className="absolute left-0 top-0 w-[2px] -translate-x-[0.5px]"
              style={{
                height: 120,
                background:
                  "linear-gradient(180deg, #ff9a6d 0%, #ff9a6d66 35%, #ff9a6d33 67%, transparent 100%)",
                animation: `flowDown 10s linear infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
