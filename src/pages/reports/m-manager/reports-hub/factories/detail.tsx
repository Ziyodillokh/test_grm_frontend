import { useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { Loader, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import { ListRow } from "@/components/ui/list-row";
import { useMeStore } from "@/store/me-store";
import { useFactoryDetail } from "./queries";
import formatPrice from "@/utils/formatPrice";
import TebleAvatar from "@/components/teble-avatar";
import ReportToolbar from "@/components/report-toolbar";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

const gridTemplate = "90px 60px 120px 120px 1fr 40px";
const columnLabels = ["Summa", "", "Turi", "Sana", "Ma'lumotlar", ""];

export default function FactoryDetailPage() {
  const { factoryId } = useParams();
  const { meUser } = useMeStore();
  const currentYear = String(new Date().getFullYear());
  const [yearFilter, setYearFilter] = useQueryState("year", parseAsString.withDefault(currentYear));
  const [startDate, setStartDate] = useQueryState("startDate", parseAsString);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsString);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const activeYear = Number(yearFilter);

  const hasActiveFilter = yearFilter !== currentYear || !!startDate || !!endDate;
  const clearFilters = () => {
    setYearFilter(null);
    setStartDate(null);
    setEndDate(null);
  };

  const { data, isLoading } = useFactoryDetail({
    factoryId: factoryId || "",
    queries: {
      year: activeYear,
      ...(startDate ? { fromDate: startDate } : {}),
      ...(endDate ? { toDate: endDate } : {}),
    },
    enabled: !!factoryId,
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const factory = data?.pages?.[0]?.factory;

  const toggleExpand = (itemId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ReportToolbar
        totalsItems={[
          { label: (factory?.title || "") + ":", value: factory?.owed || 0, color: "#FF6600" },
          { value: factory?.given || 0, color: "#47B13C" },
          { value: factory?.totalDebt || 0, color: "#1a1a1a" },
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
            <div className="flex flex-col gap-[6px] col-span-2">
              <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Davr</p>
              <DateRangePicker
                variant="filter"
                fromPlaceholder="Boshlanish"
                toPlaceholder="Tugash"
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
          items.map((item: any) => {
            const isPartiya = item.entry_type === "partiya";
            const isExpanded = expandedRows.has(item.id);
            const hasCollections = isPartiya && item.collections && item.collections.length > 0;

            const typeColor = isPartiya ? "#3ABC49" : "#EF5C12";

            const avatarName = isPartiya
              ? (meUser?.firstName || "M")
              : (item.who_paid?.split(" ")?.[0] || "?");
            const avatarUrl = isPartiya
              ? meUser?.avatar?.path
              : undefined;

            return (
              <div key={item.id}>
                <ListRow
                  gridTemplate={gridTemplate}
                  gridGap="16px"
                  className={hasCollections ? "cursor-pointer" : ""}
                  onClick={() => {
                    if (hasCollections) toggleExpand(item.id);
                  }}
                >
                  {/* Summa */}
                  <div className="text-right">
                    <span className={`text-[15px] font-medium ${isPartiya ? "text-[#1a1a1a]" : "text-[#EF5C12]"}`}>
                      {isPartiya ? "+" : "-"} {formatPrice(item.total_cost || 0)}
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
                      {isPartiya ? "Partiya" : "To'lov"}
                    </span>
                  </div>

                  {/* Sana */}
                  <span className="text-[13px] text-[#1a1a1a]">
                    {item.date ? format(new Date(item.date), "dd MMM yyyy") : "—"}
                  </span>

                  {/* Malumotlar */}
                  <span className="text-[13px] text-[#1a1a1a] truncate">
                    {isPartiya ? (
                      <>
                        {item.partiya_name || "Partiya"}
                        {item.total_kv ? (
                          <span className="text-[#a3a3a3] ml-2">{formatPrice(item.total_kv)} m²</span>
                        ) : null}
                      </>
                    ) : (
                      <>
                        {item.comment || "—"}
                        {item.who_paid && (
                          <span className="text-[#a3a3a3] ml-2">({item.who_paid})</span>
                        )}
                      </>
                    )}
                  </span>

                  {/* Expand chevron */}
                  <div className="flex items-center justify-center">
                    {hasCollections ? (
                      isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-[#a3a3a3]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[#a3a3a3]" />
                      )
                    ) : null}
                  </div>
                </ListRow>

                {/* Expanded collections */}
                {isPartiya && isExpanded && item.collections && (
                  <div className="flex flex-col gap-[2px] ml-[12px]">
                    {item.collections.map((col: any, idx: number) => (
                      <div
                        key={`${item.id}-col-${idx}`}
                        className="bg-[#f5f7f9] rounded-sm px-[12px] py-[10px]"
                        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "16px", alignItems: "center" }}
                      >
                        <div className="text-right">
                          <span className="text-[13px] font-medium text-[#1a1a1a]">
                            {formatPrice(col.total_cost)} $
                          </span>
                        </div>
                        <div />
                        <div />
                        <div />
                        <div className="text-[13px] text-[#1a1a1a] flex items-center gap-[12px]">
                          <span>{col.collection_title}</span>
                          <span className="text-[#a3a3a3]">{formatPrice(col.total_kv)} m²</span>
                          <span className="text-[#a3a3a3]">× {formatPrice(col.price_per_kv)} $</span>
                        </div>
                        <div />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
