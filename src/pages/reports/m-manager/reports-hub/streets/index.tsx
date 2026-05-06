import { useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { ListRow } from "@/components/ui/list-row";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { useYear } from "@/store/year-store";
import formatPrice from "@/utils/formatPrice";

import StreetFilter from "./filter";
import { useStreetReport } from "./queries";

const gridTemplate = "40px 1fr 130px 110px 110px 110px 110px 110px 110px";
const columnLabels = ["№", "Ism", "Telefon", "Olingan", "Foiz", "Qaytarilgan", "Qolgan", "Davriy olingan", "Davriy qaytarilgan"];

export default function StreetReportPage() {
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);
  const { year } = useYear();
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));
  const [search] = useQueryState("search", parseAsString);
  const [excelPending, setExcelPending] = useState(false);

  const { data, isLoading } = useStreetReport({
    queries: {
      year,
      month: Number(month),
      search: search || undefined,
      limit: 100,
    },
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;

  const handleExport = async () => {
    setExcelPending(true);
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      window.open(`${baseUrl}/street/report/excel?year=${year}&month=${month}`, "_blank");
    } finally {
      setExcelPending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <StreetFilter totals={totals} onExport={handleExport} excelPending={excelPending} />

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
                const path = `/m-manager/reports-hub/streets/${item.id}`;
                push(item.fullName || "Ko'cha", path);
                navigate(path);
              }}
            >
              <span className="text-[13px] text-[#a3a3a3]">{i + 1}</span>
              <span className="text-[13px] font-medium text-[#1a1a1a]">{item.fullName}</span>
              <span className="text-[13px] text-[#1a1a1a]">{item.phone}</span>
              <span className="text-[13px] font-medium text-[#1a1a1a]">{formatPrice(item.owed || 0)} $</span>
              <span className="text-[13px] font-medium text-[#1a1a1a]">{formatPrice(item.percent || 0)} $</span>
              <span className="text-[13px] font-medium text-[#47B13C]">{formatPrice(item.given || 0)} $</span>
              <span className="text-[13px] font-medium text-[#ef4444]">{formatPrice(item.totalDebt || 0)} $</span>
              <span className="text-[13px] text-[#1a1a1a]">{formatPrice(item.period_income || 0)} $</span>
              <span className="text-[13px] text-[#47B13C]">{formatPrice(item.period_expense || 0)} $</span>
            </ListRow>
          ))
        )}
      </div>
    </div>
  );
}
