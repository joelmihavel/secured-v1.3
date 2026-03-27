import { TableCell, TableRow } from "@/components/ui/table";
import type { ReactNode } from "react";

type ComparisonRowProps = {
  label: string;
  sub?: string;
  flent: ReactNode;
  trad: ReactNode;
  divider?: boolean;
};

export function ComparisonRow({
  label,
  sub,
  flent,
  trad,
  divider = false,
}: ComparisonRowProps) {
  return (
    <TableRow className={divider ? "bg-secondary-background" : ""}>
      <TableCell className="px-4 py-3 text-xs text-foreground md:text-sm">
        <div className="text-[13px] font-medium text-text-main">{label}</div>
        {sub ? <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div> : null}
      </TableCell>
      <TableCell className="border-l-2 border-border px-2.5 py-3 text-center text-xs text-foreground md:text-sm">
        {flent}
      </TableCell>
      <TableCell className="border-l-2 border-border px-2.5 py-3 text-center text-xs text-foreground md:text-sm">
        {trad}
      </TableCell>
    </TableRow>
  );
}
