import { useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { ChevronDown } from "lucide-react";

import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { FilterDateInput, FILTER_INPUT_TRIGGER } from "@/components/filters-ui/filter-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";
import { useFilialList } from "./queries";

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
  const role = meUser?.position?.role ?? 0;
  const isManager = role >= 9;

  const [search, setSearch] = useQueryState("search", parseAsString);
  const [date, setDate] = useQueryState("date", parseAsString.withDefault(""));
  const [filialId, setFilialId] = useQueryState("filialId", parseAsString.withDefault(""));
  const [view, setView] = useQueryState("view", parseAsString);
  const [excelPending, setExcelPending] = useState(false);

  const { data: filialData } = useFilialList({ enabled: isManager });
  const filials = filialData?.pages?.[0]?.items || [];

  const hasActiveFilter = !!search || !!date || !!filialId || !!view;
  const clearFilters = () => {
    setSearch(null);
    setDate(null);
    setFilialId("");
    setView(null);
  };

  const handleExcelExport = async () => {
    setExcelPending(true);
    try {
      const fId = filialId || meUser?.filial?.id || "";
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
      filterContent={
        <>
          {isManager && (
            <div className="flex flex-col gap-[6px]">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Filial</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className={FILTER_INPUT_TRIGGER}>
                    <span className="flex-1 text-left truncate">
                      {filialId
                        ? filials.find((f: any) => f.id === filialId)?.name ||
                          filials.find((f: any) => f.id === filialId)?.title
                        : "Barchasi"}
                    </span>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a] shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-[var(--radix-popover-trigger-width)] p-[4px] max-h-[320px] overflow-y-auto scrollCastom"
                >
                  <button
                    type="button"
                    onClick={() => setFilialId("")}
                    className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${
                      !filialId ? "bg-[#f5f7f9] font-medium" : ""
                    }`}
                  >
                    Barchasi
                  </button>
                  {filials.map((f: any) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilialId(f.id)}
                      className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${
                        filialId === f.id ? "bg-[#f5f7f9] font-medium" : ""
                      }`}
                    >
                      {f.name || f.title}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          )}
          {isManager && (
            <div className="flex flex-col gap-[6px]">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Ko'rinish</p>
              <FilterSelect
                variant="filter"
                placeholder="Turini tanlang"
                classNameContainer="z-[60]"
                defaultValue="filial"
                options={[
                  { label: "Filial bo'yicha", value: "filial" },
                  { label: "Partiya bo'yicha", value: "partiya" },
                ]}
                name="view"
              />
            </div>
          )}
          <div className="col-span-2 flex flex-col gap-[6px]">
            <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Sana</p>
            <FilterDateInput value={date} onChange={(v) => setDate(v)} placeholder="Sanani tanlang" />
          </div>
        </>
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
