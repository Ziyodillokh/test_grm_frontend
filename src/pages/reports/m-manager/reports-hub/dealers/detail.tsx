import { useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { Loader, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { ListRow } from "@/components/ui/list-row";
import { MonthsArray } from "@/consts";
import { useYear } from "@/store/year-store";
import { useDealerKassaDetail } from "@/pages/reports/d-manager/report/queries";
import formatPrice from "@/utils/formatPrice";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

const gridTemplate = "80px 120px 120px 1fr 40px";
const columnLabels = ["Summa", "Turi", "Sana", "Ma'lumotlar", ""];

export default function DealerDetailPage() {
  const { dealerId } = useParams();
  const { year } = useYear();
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));
  const [yearFilter] = useQueryState("year", parseAsString);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [, setMonthQs] = useQueryState("month", parseAsString);
  const [, setYearQs] = useQueryState("year", parseAsString);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const activeYear = yearFilter ? Number(yearFilter) : year;

  const { data, isLoading } = useDealerKassaDetail({
    dealerId: dealerId || "",
    queries: {
      year: activeYear,
      month: Number(month),
    },
    enabled: !!dealerId,
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;
  const dealer = data?.pages?.[0]?.dealer;

  const toggleExpand = (itemId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const clearFilters = () => {
    setSearch(null);
    setMonthQs(null);
    setYearQs(null);
  };
  const hasActiveFilter = !!search;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar — reusable component */}
      <div className="shrink-0">
        <ReportToolbar
          hasActiveFilter={hasActiveFilter}
          onClearFilters={clearFilters}
          filterContent={
            <>
              <div className="flex flex-col gap-[6px]">
                <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Yil</p>
                <FilterSelect
                  variant="filter"
                  placeholder="Yil tanlang"
                  classNameContainer="z-[60]"
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
                  classNameContainer="z-[60]"
                  options={MonthsArray}
                  name="month"
                  defaultValue={String(new Date().getMonth() + 1)}
                />
              </div>
            </>
          }
          totalsItems={[
            { label: dealer?.title, value: totals?.period_owed || 0, color: "#FF6600" },
            { value: totals?.period_given || 0, color: "#47B13C" },
            { value: dealer?.balance || 0, color: "#1a1a1a" },
          ]}
        />
      </div>

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
            const isPackage = item.entry_type === "package";
            const isExpanded = expandedRows.has(item.id);
            const hasCollections = isPackage && item.collections && item.collections.length > 0;

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
                    <span className={`text-[15px] font-medium ${isPackage ? "text-[#FF6600]" : "text-[#1a1a1a]"}`}>
                      {isPackage ? "-" : "+"} {formatPrice(item.total_cost || 0)}
                    </span>
                  </div>

                  {/* Turi */}
                  <div className="flex items-center gap-[6px]">
                    <span
                      className="w-[6px] h-[6px] rounded-full shrink-0"
                      style={{ backgroundColor: isPackage ? "#FF6600" : "#3ABC49" }}
                    />
                    <span className="text-[13px] font-medium text-[#1a1a1a]">
                      {isPackage ? "Paket" : "To'lov"}
                    </span>
                  </div>

                  {/* Sana */}
                  <span className="text-[13px] text-[#1a1a1a]">
                    {item.date ? format(new Date(item.date), "dd MMM yyyy") : "—"}
                  </span>

                  {/* Malumotlar */}
                  <span className="text-[13px] text-[#1a1a1a] truncate">
                    {isPackage ? (
                      <>
                        {item.title || "Paket"}
                        {item.total_kv ? (
                          <span className="text-[#a3a3a3] ml-2">{formatPrice(item.total_kv)} m²</span>
                        ) : null}
                      </>
                    ) : (
                      <>
                        {item.comment || "—"}
                        {item.is_online && (
                          <span className="ml-2 text-[#0078D4]">(online)</span>
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
                {isPackage && isExpanded && item.collections && (
                  <div className="flex flex-col gap-[2px] ml-[12px]">
                    {item.collections.map((col: any, idx: number) => (
                      <div
                        key={`${item.id}-col-${idx}`}
                        className="bg-[#f5f7f9] rounded-sm px-[12px] py-[10px]"
                        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "16px", alignItems: "center" }}
                      >
                        <div className="text-right">
                          <span className="text-[13px] font-medium text-[#FF6600]">
                            {formatPrice(col.total_cost)} $
                          </span>
                        </div>
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
