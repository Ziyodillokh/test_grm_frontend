import { useState, useRef } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { X, Loader, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import FilterSelect from "@/components/filters-ui/filter-select";
import { ListRow } from "@/components/ui/list-row";
import { MonthsArray } from "@/consts";
import { useYear } from "@/store/year-store";
import { useDealerKassaDetail } from "@/pages/reports/d-manager/report/queries";
import formatPrice from "@/utils/formatPrice";
import debounce from "@/utils/debounce";
import ReportTotalsBar from "@/components/report-totals-bar";

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
  const [showSearch, setShowSearch] = useState(!!search);
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    setFilterOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-[4px] shrink-0 mb-[10px]">
        {/* Search */}
        {showSearch ? (
          <div className="flex items-center gap-[4px] bg-white rounded-sm px-[10px] h-[42px]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15.7508 15.7508L12.4883 12.4883" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Input
              ref={searchInputRef}
              autoFocus
              defaultValue={search || ""}
              onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value || null);
              }, 500)}
              className="bg-transparent border-none h-[32px] w-[200px] p-0 text-[14px] shadow-none"
              placeholder="Qidirish..."
            />
            <X
              className="w-[16px] h-[16px] cursor-pointer text-[#A3A3A3] hover:text-[#1A1A1A]"
              onClick={() => {
                if (searchInputRef.current) searchInputRef.current.value = "";
                setSearch(null);
                setShowSearch(false);
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15.7508 15.7508L12.4883 12.4883" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Sort */}
        <button className="w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask_sort_dd" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="1" y="3" width="16" height="12">
              <path d="M2.25 6.75L5.25 3.75M5.25 3.75L8.25 6.75M5.25 3.75V14.25M15.75 11.25L12.75 14.25M12.75 14.25L9.75 11.25M12.75 14.25V3.75" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </mask>
            <g mask="url(#mask_sort_dd)">
              <rect x="9" y="1" width="10" height="16" fill="#0078D4" />
              <rect x="-1" y="1" width="10" height="16" fill="#1A1A1A" />
            </g>
          </svg>
        </button>

        {/* Filter */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <button className="w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 3H2.25M9.75 12H5.25M8.25 15H11.25M4.5 6H15M3 9H12" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[340px] p-4">
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Yil</p>
                <FilterSelect
                  placeholder="Yil tanlang"
                  className="w-full"
                  options={yearsArray}
                  name="year"
                  defaultValue={String(activeYear)}
                />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Oy</p>
                <FilterSelect
                  placeholder="Oy tanlang"
                  className="w-full"
                  options={MonthsArray}
                  name="month"
                  defaultValue={String(new Date().getMonth() + 1)}
                />
              </div>
              <Button variant="outline" onClick={clearFilters} className="w-full mt-2">
                Tozalash
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <ReportTotalsBar items={[
          { label: dealer?.title, value: totals?.period_owed || 0, color: "#FF6600" },
          { value: totals?.period_given || 0, color: "#47B13C" },
          { value: dealer?.balance || 0, color: "#1a1a1a" },
        ]} />
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
