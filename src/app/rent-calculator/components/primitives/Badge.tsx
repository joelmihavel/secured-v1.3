type BadgeProps = {
  text: string;
  tone?: "positive" | "neutral";
};

export function Badge({ text, tone = "positive" }: BadgeProps) {
  const toneClass =
    tone === "positive"
      ? "bg-pastel-green text-forest-green"
      : "bg-secondary-background text-foreground";

  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.2px] ${toneClass}`}>
      {text}
    </span>
  );
}
