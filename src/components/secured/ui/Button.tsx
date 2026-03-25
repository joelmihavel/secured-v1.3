"use client";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export function Button({
  children,
  href = "#",
  className = "",
  fullWidth = false,
  disabled = false,
  onClick,
  target,
  rel,
}: ButtonProps) {
  const widthClass = fullWidth ? "w-full" : "w-[297px]";

  if (disabled) {
    return (
      <div className={`flex flex-col items-center gap-2 rounded-xl ${widthClass} ${className}`}>
        <div className="h-[2px] w-6 rounded-[200px] bg-[#4d4d4d]" />
        <div
          className={`flex items-center justify-center overflow-hidden rounded-lg border border-[#202020] bg-[#1a1a1a] p-4 ${widthClass}`}
        >
          <span
            className="text-center text-base font-medium leading-6 text-[#8a8a8a]"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {children}
          </span>
        </div>
      </div>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      className={`btn-figma group flex flex-col items-center gap-2 rounded-xl ${widthClass} ${className}`}
    >
      {/* Top accent bar */}
      <div className="btn-figma__bar h-[2px] w-6 rounded-[200px] bg-[#4d4d4d]" />
      {/* Button body */}
      <div className="btn-figma__body relative flex items-center justify-center overflow-hidden rounded-lg border-[0.1px] border-[#ff9a6d] p-4 w-full">
        <span
          className="relative z-10 text-center text-base font-medium leading-6 text-white"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {children}
        </span>
        {/* Inner shadow overlay */}
        <div className="btn-figma__inset pointer-events-none absolute inset-0 rounded-[inherit]" />
      </div>
    </a>
  );
}
