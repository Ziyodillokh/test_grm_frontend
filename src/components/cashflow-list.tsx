import { Loader } from "lucide-react";
import { CashflowRow, cashflowGridTemplate, cashflowLabels } from "@/components/cashflow-row";
import type { TransactionItem } from "@/pages/cashflow/types";

interface CashflowListProps {
  items: TransactionItem[];
  isLoading?: boolean;
  /** Header (Summa, Status, Turi, ...) ko'rsatish. Default true */
  showHeader?: boolean;
  /** Parent grid columnGap. Default 16. */
  gap?: number;
  /** Bo'sh holat matni */
  emptyText?: string;
  isWarning?: boolean;
  onEdit?: (item: TransactionItem) => void;
  onDelete?: (item: TransactionItem) => void;
  /** Header'dan oldin chiqadigan element (filterlar, totals, etc.) */
  beforeHeader?: React.ReactNode;
}

/**
 * Cashflowlar ro'yxati uchun standart UI komponenti.
 *
 * Pattern:
 * - Parent grid 11 ustun: 6 content + 5 progressive spacer (10/15/20/25/30 px).
 * - Avatar (Status) ustuni `max-content` (fixed emas).
 * - Har row `subgrid` orqali parent ustunlarini meros qiladi → ustunlar bir tekisda turadi.
 * - Yon padding 12px.
 *
 * Foydalanish:
 * ```tsx
 * <CashflowList items={items} isLoading={isLoading} gap={10} />
 * ```
 */
export function CashflowList({
  items,
  isLoading = false,
  showHeader = true,
  gap = 16,
  emptyText = "Ma'lumot topilmadi",
  onEdit,
  onDelete,
  isWarning,
  beforeHeader,
}: CashflowListProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: cashflowGridTemplate,
        columnGap: `${gap}px`,
        rowGap: "4px",
      }}
    >
      {beforeHeader}

      {showHeader && (
        <div
          style={{
            gridColumn: "1 / -1",
            display: "grid",
            gridTemplateColumns: "subgrid",
            columnGap: `${gap}px`,
            paddingLeft: "12px",
            paddingRight: "12px",
            marginBottom: "6px",
          }}
        >
          {cashflowLabels.map((label, i) => (
            <span
              key={i}
              className={`text-[13px] text-[#A3A3A3] ${(label as any).right ? "text-right" : ""} ${(label as any).center ? "text-center" : ""}`}
            >
              {label.text}
            </span>
          ))}
        </div>
      )}

      {isLoading ? (
        <div
          className="flex items-center justify-center h-[200px]"
          style={{ gridColumn: "1 / -1" }}
        >
          <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
        </div>
      ) : items.length === 0 ? (
        <div
          className="flex items-center justify-center h-[200px]"
          style={{ gridColumn: "1 / -1" }}
        >
          <span className="text-[13px] text-[#a3a3a3]">{emptyText}</span>
        </div>
      ) : (
        items.map((item: any) => (
          <CashflowRow
            key={item.id}
            item={item}
            subgrid
            onEdit={onEdit}
            onDelete={onDelete}
            isWarning={isWarning}
          />
        ))
      )}
    </div>
  );
}
