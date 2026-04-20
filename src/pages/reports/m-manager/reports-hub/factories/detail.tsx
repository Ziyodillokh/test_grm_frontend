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
import { useFactoryDetail } from "./queries";
import formatPrice from "@/utils/formatPrice";
import debounce from "@/utils/debounce";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

const gridTemplate = "80px 120px 120px 1fr 40px";
const columnLabels = ["Summa", "Turi", "Sana", "Ma'lumotlar", ""];

export default function FactoryDetailPage() {
  const { factoryId } = useParams();
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));
  const [yearFilter] = useQueryState("year", parseAsString.withDefault(String(new Date().getFullYear())));
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [showSearch, setShowSearch] = useState(!!search);
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeYear = Number(yearFilter);

  const { data, isLoading } = useFactoryDetail({
    factoryId: factoryId || "",
    queries: {
      year: activeYear,
      month: Number(month),
    },
    enabled: !!factoryId,
  });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;
  const factory = data?.pages?.[0]?.factory;

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
          <div className="flex items-center gap-[4px] bg-white rounded-[8px] px-[10px] h-[42px]">
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
            className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15.7508 15.7508L12.4883 12.4883" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Filter */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <button className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
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

        {/* Totals */}
        <div className="ml-auto flex items-center gap-[16px] bg-white rounded-[8px] px-[16px] h-[42px]">
          <span className="text-[13px] text-[#A3A3A3]">{factory?.title || ""}</span>
          <span className="text-[14px] font-medium text-[#FF6600]">
            {formatPrice(totals?.period_owed || 0)} $
          </span>
          <span className="text-[14px] font-medium text-[#47B13C]">
            {formatPrice(totals?.period_given || 0)} $
          </span>
          <span className="text-[14px] font-bold text-[#1a1a1a]">
            {formatPrice(factory?.totalDebt || 0)} $
          </span>
        </div>
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
            const isPartiya = item.entry_type === "partiya";
            const isExpanded = expandedRows.has(item.id);
            const hasCollections = isPartiya && item.collections && item.collections.length > 0;

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
                    <span className={`text-[15px] font-medium ${isPartiya ? "text-[#FF6600]" : "text-[#1a1a1a]"}`}>
                      {isPartiya ? "-" : "+"} {formatPrice(item.total_cost || 0)}
                    </span>
                  </div>

                  {/* Turi */}
                  <div className="flex items-center gap-[6px]">
                    <span
                      className="w-[6px] h-[6px] rounded-full shrink-0"
                      style={{ backgroundColor: isPartiya ? "#FF6600" : "#3ABC49" }}
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
                      <>{item.comment || "—"}</>
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
                        className="bg-[#f5f5f5] rounded-[8px] px-[12px] py-[10px]"
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
