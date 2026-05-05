import { useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { format } from "date-fns";
import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { ListRow } from "@/components/ui/list-row";
import { cashflowLabels } from "@/components/cashflow-row";
import TebleAvatar from "@/components/teble-avatar";
import { useYear } from "@/store/year-store";
import { useKentDetail } from "./queries";
import formatPrice from "@/utils/formatPrice";

const gridTemplate = "80px 60px 120px 120px 1fr 70px";

export default function KentDetailPage() {
  const { debtId } = useParams();
  const { year } = useYear();
  const [typeFilter] = useQueryState("type", parseAsString);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [startDate, setStartDate] = useQueryState("startDate", parseAsString);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsString);
  const [, setTypeQs] = useQueryState("type", parseAsString);
  const [excelPending, setExcelPending] = useState(false);

  const { data, isLoading } = useKentDetail({
    debtId: debtId || "",
    queries: {
      year,
      ...(startDate ? { fromDate: startDate } : {}),
      ...(endDate ? { toDate: endDate } : {}),
      type: typeFilter === "clear" ? undefined : typeFilter || undefined,
      limit: 100,
    },
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const debt = data?.pages?.[0]?.debt;

  const handleExport = () => {
    setExcelPending(true);
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const dateParams = [
        startDate ? `fromDate=${startDate}` : "",
        endDate ? `toDate=${endDate}` : "",
      ].filter(Boolean).join("&");
      window.open(`${baseUrl}/debt/report/excel?year=${year}&debtId=${debtId}${dateParams ? "&" + dateParams : ""}`, "_blank");
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
      {/* Toolbar — reusable component */}
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
            { label: debt?.fullName, value: debt?.owed || 0, color: "#FF6600" },
            { value: debt?.given || 0, color: "#47B13C" },
            { value: debt?.totalDebt || 0, color: "#1a1a1a" },
          ]}
        />
      </div>

      {/* Column labels */}
      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "16px" }}
      >
        {cashflowLabels.map((label, i) => (
          <span key={i} className={`text-[13px] text-[#A3A3A3] ${label.right ? "text-right" : ""} ${label.center ? "text-center" : ""}`}>{label.text}</span>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          items.map((item: any, i: number) => {
            const isIncome = item.type === "income";
            const typeColor = isIncome ? "#3ABC49" : "#EF5C12";
            const user = item.createdBy;

            return (
              <ListRow
                key={item.id || i}
                gridTemplate={gridTemplate}
                gridGap="16px"
              >
                {/* Summa */}
                <div className="text-right">
                  <span className={`text-[15px] font-medium ${isIncome ? "text-[#1a1a1a]" : "text-[#EF5C12]"}`}>
                    {isIncome ? "+" : "-"} {formatPrice(item.price || 0)}
                  </span>
                </div>

                {/* Avatar */}
                <div className="flex items-center justify-center">
                  <TebleAvatar
                    size={42}
                    name={user?.firstName || "?"}
                    url={user?.avatar?.path}
                    status="none"
                  />
                </div>

                {/* Turi */}
                <div className="flex items-center gap-[6px]">
                  <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ backgroundColor: typeColor }} />
                  <span className="text-[13px] font-medium text-[#1a1a1a]">
                    {item.cashflow_type?.title || (isIncome ? "Olingan" : "Qaytarilgan")}
                  </span>
                </div>

                {/* Sana */}
                <span className="text-[13px] text-[#1a1a1a]">
                  {item.date ? format(new Date(item.date), "dd MMM HH:mm") : "—"}
                </span>

                {/* Malumotlar */}
                <span className="text-[13px] text-[#1a1a1a] truncate">
                  {item.comment || "—"}
                </span>

                {/* Action placeholder */}
                <div />
              </ListRow>
            );
          })
        )}
      </div>
    </div>
  );
}
