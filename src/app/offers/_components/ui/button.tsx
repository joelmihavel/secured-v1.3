import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-transform transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
    const variants = {
      default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus-visible:ring-zinc-900",
      secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus-visible:ring-zinc-400",
      outline: "border border-zinc-200 bg-white hover:bg-zinc-50 focus-visible:ring-zinc-400",
      ghost: "hover:bg-zinc-100 focus-visible:ring-zinc-400",
      link: "text-zinc-900 underline-offset-4 hover:underline focus-visible:ring-zinc-400",
    };
    const sizes = {
      default: "h-10 px-6 text-sm",
      sm: "h-8 px-4 text-xs",
      lg: "h-12 px-10 text-base",
    };
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
