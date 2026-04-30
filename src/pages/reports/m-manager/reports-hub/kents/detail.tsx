import { useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { format } from "date-fns";
import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { ListRow } from "@/components/ui/list-row";
import { cashflowLabels } from "@/components/cashflow-row";
import TebleAvatar from "@/components/teble-avatar";
import { MonthsArray } from "@/consts";
import { useYear } from "@/store/year-store";
import { useKentDetail } from "./queries";
import formatPrice from "@/utils/formatPrice";

const gridTemplate = "80px 60px 120px 120px 1fr 70px";

export default function KentDetailPage() {
  const { debtId } = useParams();
  const { year } = useYear();
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));
  const [typeFilter] = useQueryState("type", parseAsString);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [, setMonthQs] = useQueryState("month", parseAsString);
  const [, setTypeQs] = useQueryState("type", parseAsString);
  const [excelPending, setExcelPending] = useState(false);

  const { data, isLoading } = useKentDetail({
    debtId: debtId || "",
    queries: {
      year,
      month: Number(month),
      type: typeFilter === "clear" ? undefined : typeFilter || undefined,
      limit: 100,
    },
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;
  const debt = data?.pages?.[0]?.debt;

  const handleExport = () => {
    setExcelPending(true);
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      window.open(`${baseUrl}/debt/report/excel?year=${year}&month=${month}&debtId=${debtId}`, "_blank");
    } finally {
      setExcelPending(false);
    }
  };

  const clearFilters = () => {
    setSearch(null);
    setMonthQs(null);
    setTypeQs(null);
  };
  const hasActiveFilter = !!search || !!typeFilter;

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
              <div className="flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Oy</p>
                <FilterSelect
                  variant="filter"
                  placeholder="Oy tanlang"
                  classNameContainer="z-[60]"
                  options={MonthsArray}
                  name="month"
                  defaultValue={String(new Date().getMonth() + 1)}
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Turi</p>
                <FilterSelect
                  variant="filter"
                  placeholder="Hammasi"
                  classNameContainer="z-[60]"
                  options={[
                    { label: "Hammasi", value: "clear" },
                    { label: "Olingan", value: "Приход" },
                    { label: "Qaytarilgan", value: "Расход" },
                  ]}
                  defaultValue="clear"
                  name="type"
                />
              </div>
            </>
          }
          totalsItems={[
            { label: debt?.fullName, value: totals?.total_income || 0, color: "#FF6600" },
            { value: totals?.total_expense || 0, color: "#47B13C" },
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
            const isIncome = item.type === "Приход";
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
