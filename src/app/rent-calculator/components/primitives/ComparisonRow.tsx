import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ComparisonRowProps = {
  label: string;
  sub?: string;
  flent: ReactNode;
  trad: ReactNode;
  divider?: boolean;
  rowClassName?: string;
};

export function ComparisonRow({
  label,
  sub,
  flent,
  trad,
  divider = false,
  rowClassName,
}: ComparisonRowProps) {
  return (
    <TableRow className={cn(divider ? "bg-secondary-background" : "", rowClassName)}>
      <TableCell className="px-4 py-3 text-xs text-foreground md:text-base">
        <div className="text-[13px] font-medium text-text-main md:text-[16px]">{label}</div>
        {sub ? <div className="mt-0.5 text-[11px] text-muted-foreground md:text-[13px]">{sub}</div> : null}
      </TableCell>
      <TableCell className="px-2.5 py-3 text-center text-xs text-foreground md:text-base">
        {flent}
      </TableCell>
      <TableCell className="px-2.5 py-3 text-center text-xs text-foreground md:text-base">
        {trad}
      </TableCell>
    </TableRow>
  );
}
