import formatPrice from "@/utils/formatPrice";

export interface TotalItem {
  label?: string;
  value: number;
  color: string;
}

interface ReportTotalsBarProps {
  items: TotalItem[];
}

export default function ReportTotalsBar({ items }: ReportTotalsBarProps) {
  return (
    <div className="ml-auto flex items-center gap-[16px] bg-white rounded-[8px] px-[16px] h-[42px]">
      {items.map((item, i) => (
        <span
          key={i}
          className="text-[14px] font-medium"
          style={{ color: item.color }}
        >
          {item.label && (
            <span className="text-[13px] text-[#A3A3A3] mr-[4px]">{item.label}</span>
          )}
          {formatPrice(item.value || 0)} $
        </span>
      ))}
    </div>
  );
}
