import { useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { CashflowList } from "@/components/cashflow-list";
import { useYear } from "@/store/year-store";
import { useStreetDetail } from "./queries";

export default function StreetDetailPage() {
  const { streetId } = useParams();
  const { year } = useYear();
  const [typeFilter] = useQueryState("type", parseAsString);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [startDate, setStartDate] = useQueryState("startDate", parseAsString);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsString);
  const [, setTypeQs] = useQueryState("type", parseAsString);
  const [excelPending, setExcelPending] = useState(false);

  const { data, isLoading } = useStreetDetail({
    streetId: streetId || "",
    queries: {
      year,
      ...(startDate ? { fromDate: startDate } : {}),
      ...(endDate ? { toDate: endDate } : {}),
      type: typeFilter === "clear" ? undefined : typeFilter || undefined,
      limit: 100,
    },
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const street = data?.pages?.[0]?.street;

  const handleExport = () => {
    setExcelPending(true);
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const dateParams = [
        startDate ? `fromDate=${startDate}` : "",
        endDate ? `toDate=${endDate}` : "",
      ].filter(Boolean).join("&");
      window.open(`${baseUrl}/street/report/excel?year=${year}&streetId=${streetId}${dateParams ? "&" + dateParams : ""}`, "_blank");
    } finally {
      setExcelPending(false);
    }
  };

  const clearFilters = () => {
    setSearch(null);
    setStartDate(null);
    setEndDate(null);
    setTypeQs(null);
  };
  const hasActiveFilter = !!search || !!typeFilter || !!startDate || !!endDate;

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0">
        <ReportToolbar
          hasActiveFilter={hasActiveFilter}
          onClearFilters={clearFilters}
          onExport={handleExport}
          excelPending={excelPending}
          filterContent={
            <>
              <div className="flex flex-col gap-[6px] col-span-2">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Davr</p>
                <DateRangePicker
                  variant="filter"
                  fromPlaceholder="Boshlanish"
                  toPlaceholder="Tugash"
                />
              </div>
              <div className="flex flex-col gap-[6px] col-span-2">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Turi</p>
                <FilterSelect
                  variant="filter"
                  placeholder="Hammasi"
                  classNameContainer="z-[60]"
                  options={[
                    { label: "Hammasi", value: "clear" },
                    { label: "Olingan", value: "income" },
                    { label: "Qaytarilgan", value: "expense" },
                  ]}
                  defaultValue="clear"
                  name="type"
                />
              </div>
            </>
          }
          totalsItems={[
            { label: street?.fullName, value: street?.owed || 0, color: "#1a1a1a" },
            { value: street?.percent || 0, color: "#1a1a1a" },
            { value: street?.given || 0, color: "#47B13C" },
            { value: street?.totalDebt || 0, color: "#ef4444" },
          ]}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-auto scrollCastom">
        <CashflowList items={items as any} isLoading={isLoading} gap={10} />
      </div>
    </div>
  );
}
