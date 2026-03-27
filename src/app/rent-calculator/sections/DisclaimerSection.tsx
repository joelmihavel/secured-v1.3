type DisclaimerSectionProps = {
  area: string;
};

export function DisclaimerSection({ area }: DisclaimerSectionProps) {
  return (
    <section className="pb-6 text-center">
      <p className="mx-auto max-w-[420px] text-[11px] leading-5 text-muted-foreground/60">
        Traditional rental defaults based on avg. {area} market rates. Deposit opportunity cost @
        12% p.a. All traditional-side numbers are editable.
      </p>
    </section>
  );
}
