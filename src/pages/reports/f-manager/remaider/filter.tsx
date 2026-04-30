import { useState } from "react";
import { parseAsString, useQueryState } from "nuqs";

import ReportToolbar from "@/components/report-toolbar";
import { FilterDateInput } from "@/components/filters-ui/filter-input";
import { useMeStore } from "@/store/me-store";
import { apiRoutes } from "@/service/apiRoutes";

export default function Filters({
  totalCount,
  totalKv,
  totalSum,
  totalProfit,
}: {
  totalCount: number;
  totalKv: number;
  totalSum: number;
  totalProfit: number;
}) {
  const { meUser } = useMeStore();
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [date, setDate] = useQueryState("date", parseAsString.withDefault(""));
  const [excelPending, setExcelPending] = useState(false);

  const hasActiveFilter = !!search || !!date;
  const clearFilters = () => {
    setSearch(null);
    setDate(null);
  };

  const handleExcelExport = async () => {
    setExcelPending(true);
    try {
      const fId = meUser?.filial?.id || "";
      const url = import.meta.env.VITE_BASE_URL + apiRoutes.excelProductExcelNew + `?filialId=${fId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Export xatolik: ${response.status}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "qoldiq-hisobot.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } finally {
      setExcelPending(false);
    }
  };

  return (
    <ReportToolbar
      hasActiveFilter={hasActiveFilter}
      onClearFilters={clearFilters}
      onExport={handleExcelExport}
      excelPending={excelPending}
      filterCols={1}
      filterContent={
        <div className="flex flex-col gap-[6px]">
          <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Sana</p>
          <FilterDateInput value={date} onChange={(v) => setDate(v)} placeholder="Sanani tanlang" />
        </div>
      }
      totalsItems={[
        { value: totalCount, suffix: "ta" },
        { value: totalKv, suffix: "m²" },
        { value: totalSum, suffix: "$" },
        { value: totalProfit, suffix: "$", color: "#47B13C" },
      ]}
    />
  );
}
