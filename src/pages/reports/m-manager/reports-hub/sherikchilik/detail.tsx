import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { format } from "date-fns";
import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { ListRow } from "@/components/ui/list-row";
import TebleAvatar from "@/components/teble-avatar";
import { useYear } from "@/store/year-store";
import formatPrice from "@/utils/formatPrice";

import { useShareDetail } from "./queries";

const gridTemplate = "minmax(80px,max-content) 60px minmax(120px,max-content) minmax(110px,max-content) 1fr 70px";
const columnLabels = [
  { text: "Summa", right: true },
  { text: "Status", center: true },
  { text: "Turi", center: false },
  { text: "Sana", center: false },
  { text: "Ma'lumotlar", center: false },
  { text: "", center: false },
];

export default function SherikchilikDetailPage() {
  const { shareId } = useParams();
  const { year } = useYear();
  const [typeFilter] = useQueryState("type", parseAsString);
  const [kindFilter] = useQueryState("kind", parseAsString);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [startDate, setStartDate] = useQueryState("startDate", parseAsString);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsString);
  const [, setTypeQs] = useQueryState("type", parseAsString);
  const [, setKindQs] = useQueryState("kind", parseAsString);

  const { data, isLoading } = useShareDetail({
    shareId: shareId || "",
    queries: {
      year,
      ...(startDate ? { fromDate: startDate } : {}),
      ...(endDate ? { toDate: endDate } : {}),
      type: typeFilter === "clear" ? undefined : typeFilter || undefined,
      kind: kindFilter === "clear" ? undefined : kindFilter || undefined,
      limit: 100,
    },
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const share = data?.pages?.[0]?.share;

  const clearFilters = () => {
    setSearch(null);
    setStartDate(null);
    setEndDate(null);
    setTypeQs(null);
    setKindQs(null);
  };
  const hasActiveFilter = !!search || !!typeFilter || !!kindFilter || !!startDate || !!endDate;

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0">
        <ReportToolbar
          hasActiveFilter={hasActiveFilter}
          onClearFilters={clearFilters}
          filterContent={
            <>
              <div className="flex flex-col gap-[6px] col-span-2">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Davr</p>
                <DateRangePicker variant="filter" fromPlaceholder="Boshlanish" toPlaceholder="Tugash" />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Turi</p>
                <FilterSelect
                  variant="filter"
                  placeholder="Hammasi"
                  classNameContainer="z-[60]"
                  options={[
                    { label: "Hammasi", value: "clear" },
                    { label: "Olingan (Ulush)", value: "income" },
                    { label: "Berilgan", value: "expense" },
                  ]}
                  defaultValue="clear"
                  name="type"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Berilgan turi</p>
                <FilterSelect
                  variant="filter"
                  placeholder="Hammasi"
                  classNameContainer="z-[60]"
                  options={[
                    { label: "Hammasi", value: "clear" },
                    { label: "Tani", value: "capital" },
                    { label: "Foyda", value: "profit" },
                  ]}
                  defaultValue="clear"
                  name="kind"
                />
              </div>
            </>
          }
          totalsItems={[
            { label: share?.fullName, value: share?.capital || 0, color: "#47B13C" },
            { value: share?.profit || 0, color: "#FF6600" },
            { value: share?.given_capital || 0, color: "#EF5C12" },
            { value: share?.given_profit || 0, color: "#EF5C12" },
            { value: share?.totalDebt || 0, color: "#1a1a1a" },
          ]}
        />
      </div>

      <div
        className="mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "16px" }}
      >
        {columnLabels.map((label, i) => (
          <span
            key={i}
            className={`text-[13px] text-[#A3A3A3] ${label.right ? "text-right" : ""} ${label.center ? "text-center" : ""}`}
          >
            {label.text}
          </span>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          items.map((item, i: number) => {
            const isIncome = item.type === "income";
            const isCapital = item.shareKind === "capital";
            const typeLabel = isCapital
              ? isIncome
                ? "Tan kirim"
                : "Tan chiqim"
              : isIncome
                ? "Foyda kirim"
                : "Foyda chiqim";
            const typeColor = isIncome
              ? isCapital
                ? "#47B13C"
                : "#3ABC49"
              : isCapital
                ? "#EF5C12"
                : "#FF6600";
            const user = item.createdBy;

            return (
              <ListRow key={item.id || i} gridTemplate={gridTemplate} gridGap="16px">
                <div className="text-right whitespace-nowrap">
                  <span className={`text-[15px] font-medium ${isIncome ? "text-[#47B13C]" : "text-[#EF5C12]"}`}>
                    {isIncome ? "+" : "-"} {formatPrice(item.price || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-center">
                  <TebleAvatar
                    size={42}
                    name={user?.firstName || "?"}
                    url={user?.avatar?.path}
                    status="none"
                  />
                </div>

                <div className="flex items-center gap-[6px] whitespace-nowrap">
                  <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ backgroundColor: typeColor }} />
                  <span className="text-[13px] font-medium text-[#1a1a1a]">{typeLabel}</span>
                </div>

                <span className="text-[13px] text-[#1a1a1a] whitespace-nowrap">
                  {item.date ? format(new Date(item.date), "dd MMM HH:mm") : "—"}
                </span>

                <span className="text-[13px] text-[#1a1a1a] truncate">{item.comment || "—"}</span>

                <div />
              </ListRow>
            );
          })
        )}
      </div>
    </div>
  );
}
