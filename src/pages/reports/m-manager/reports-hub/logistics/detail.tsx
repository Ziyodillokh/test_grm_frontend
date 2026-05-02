import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { format } from "date-fns";
import FilterSelect from "@/components/filters-ui/filter-select";
import { ListRow } from "@/components/ui/list-row";
import { MonthsArray } from "@/consts";
import { useLogisticsDetail } from "./queries";
import formatPrice from "@/utils/formatPrice";
import TebleAvatar from "@/components/teble-avatar";
import ReportToolbar from "@/components/report-toolbar";
import { LogisticsDetailItem } from "./type";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

const gridTemplate = "90px 60px 120px 120px 1fr";
const columnLabels = ["Summa", "", "Turi", "Sana", "Ma'lumotlar"];

export default function LogisticsDetailPage() {
  const { logisticsId } = useParams();
  const currentYear = String(new Date().getFullYear());
  const currentMonth = String(new Date().getMonth() + 1);
  const [month, setMonth] = useQueryState("month", parseAsString.withDefault(currentMonth));
  const [yearFilter, setYearFilter] = useQueryState("year", parseAsString.withDefault(currentYear));

  const activeYear = Number(yearFilter);

  const hasActiveFilter = yearFilter !== currentYear || month !== currentMonth;
  const clearFilters = () => {
    setYearFilter(null);
    setMonth(null);
  };

  const { data, isLoading } = useLogisticsDetail({
    logisticsId: logisticsId || "",
    queries: {
      year: activeYear,
      month: Number(month),
    },
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;
  const logistics = data?.pages?.[0]?.logistics;

  return (
    <div className="flex flex-col h-full">
      <ReportToolbar
        totalsItems={[
          { label: (logistics?.title || "") + ":", value: totals?.total_income || 0, color: "#FF6600" },
          { value: totals?.total_expense || 0, color: "#47B13C" },
          { value: logistics?.totalDebt || 0, color: "#1a1a1a" },
        ]}
        hasActiveFilter={hasActiveFilter}
        onClearFilters={clearFilters}
        filterContent={
          <>
            <div className="flex flex-col gap-[6px]">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Yil</p>
              <FilterSelect
                variant="filter"
                placeholder="Yil tanlang"
                options={yearsArray}
                name="year"
                defaultValue={String(activeYear)}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Oy</p>
              <FilterSelect
                variant="filter"
                placeholder="Oy tanlang"
                options={MonthsArray}
                name="month"
                defaultValue={currentMonth}
              />
            </div>
          </>
        }
      />

      {/* Column labels */}
      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "16px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className={`text-[13px] text-[#A3A3A3] ${i === 0 ? "text-right" : ""}`}>{label}</span>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          items.map((item: LogisticsDetailItem) => {
            const isIncome = item.type === "income";
            const typeColor = isIncome ? "#3ABC49" : "#EF5C12";

            const avatarName = item.createdBy?.firstName || "?";
            const avatarUrl = item.createdBy?.avatar?.path;

            return (
              <ListRow
                key={item.id}
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
                    name={avatarName}
                    url={avatarUrl}
                    status="success"
                  />
                </div>

                {/* Turi */}
                <div className="flex items-center gap-[6px]">
                  <span
                    className="w-[6px] h-[6px] rounded-full shrink-0"
                    style={{ backgroundColor: typeColor }}
                  />
                  <span className="text-[13px] font-medium text-[#1a1a1a]">
                    {isIncome ? "Kirim" : "Chiqim"}
                  </span>
                </div>

                {/* Sana */}
                <span className="text-[13px] text-[#1a1a1a]">
                  {item.date ? format(new Date(item.date), "dd MMM yyyy") : "—"}
                </span>

                {/* Malumotlar */}
                <span className="text-[13px] text-[#1a1a1a] truncate">
                  {item.comment || item.tip || "—"}
                  {item.cashflow_type && (
                    <span className="text-[#a3a3a3] ml-2">({item.cashflow_type.title})</span>
                  )}
                </span>
              </ListRow>
            );
          })
        )}
      </div>
    </div>
  );
}
