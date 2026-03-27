type EditCellProps = {
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
};

export function EditCell({ value, onChange, suffix = "" }: EditCellProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-xs text-muted-foreground">₹</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-20 rounded-sm border border-input bg-bg-white px-1.5 py-1 text-right text-sm font-bold text-text-main outline-none focus:border-ground-brown"
        step="500"
      />
      {suffix ? <span className="text-[11px] text-muted-foreground">{suffix}</span> : null}
    </span>
  );
}
