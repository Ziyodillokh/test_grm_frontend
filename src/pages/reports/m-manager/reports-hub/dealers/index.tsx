import { useNavigate, useLocation } from "react-router-dom";
import { parseAsString, useQueryState } from "nuqs";
import { Loader } from "lucide-react";
import { ListRow } from "@/components/ui/list-row";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import formatPrice from "@/utils/formatPrice";

import DealerFilter from "./filter";
import { useDealerReport } from "./queries";

const gridTemplate = "40px 1fr 120px 120px 120px 120px 120px";
const columnLabels = ["№", "Nomi", "Umumiy qarzi", "Qaytargani", "Qoldig'i", "Davriy qarzi", "Davriy qaytargani"];

export default function DealerReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const [yearFilter] = useQueryState("year", parseAsString.withDefault(String(new Date().getFullYear())));
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));
  const [search] = useQueryState("search", parseAsString);

  const year = Number(yearFilter);

  const basePath = location.pathname.includes("/d-manager/")
    ? "/d-manager/reports-hub/dealers"
    : "/m-manager/reports-hub/dealers";

  const { data, isLoading } = useDealerReport({
    queries: {
      year,
      month: Number(month),
      search: search || undefined,
      limit: 100,
    },
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;

  return (
    <div className="flex flex-col h-full">
      <DealerFilter totals={totals} />

      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className="text-[13px] text-[#A3A3A3]">{label}</span>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          items.map((item: any, i: number) => (
            <ListRow
              key={item.id || i}
              gridTemplate={gridTemplate}
              className="pl-[12px]"
              minHeight={60}
              onClick={() => {
                const path = `${basePath}/${item.id}?month=${month}&year=${year}`;
                push(item.title || "Diller", `${basePath}/${item.id}`);
                navigate(path);
              }}
            >
              <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
              <span className="text-[13px] font-medium text-[#1a1a1a]">{item.title}</span>
              <span className="text-[13px] font-medium text-[#FF6600]">{formatPrice(item.owed || 0)} $</span>
              <span className="text-[13px] font-medium text-[#47B13C]">{formatPrice(item.given || 0)} $</span>
              <span className="text-[13px] font-medium text-[#1a1a1a]">{formatPrice((item.owed || 0) - (item.given || 0))} $</span>
              <span className="text-[13px] text-[#FF6600]">{formatPrice(item.period_owed || 0)} $</span>
              <span className="text-[13px] text-[#47B13C]">{formatPrice(item.period_given || 0)} $</span>
            </ListRow>
          ))
        )}
      </div>
    </div>
  );
}
