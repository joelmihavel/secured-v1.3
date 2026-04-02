import { useRef } from "react";

type EditCellProps = {
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  onCommit?: (newValue: number, previousValue: number) => void;
};

export function EditCell({ value, onChange, onCommit }: EditCellProps) {
  const focusedValueRef = useRef<number | null>(null);

  return (
    <span className="inline-flex items-center">
      <span className="relative inline-flex items-center">
        <span className="pointer-events-none absolute left-2 text-sm font-bold text-text-main/70 md:text-[17px]">
          ₹
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          onFocus={() => {
            focusedValueRef.current = value;
          }}
          onBlur={(e) => {
            const previousValue = focusedValueRef.current ?? value;
            const nextValue = Math.max(0, Number(e.target.value));
            if (onCommit && nextValue !== previousValue) {
              onCommit(nextValue, previousValue);
            }
            focusedValueRef.current = null;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          className="h-9 w-[120px] rounded-l-none rounded-r-xl border border-black/20 bg-white pl-6 pr-2 text-left text-sm font-bold text-text-main outline-none focus:border-black/70 md:text-[17px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          step="500"
        />
      </span>
    </span>
  );
}
