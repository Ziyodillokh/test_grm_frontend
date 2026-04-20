import { useState, useRef } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { X, Loader } from "lucide-react";
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
import { cashflowLabels } from "@/components/cashflow-row";
import TebleAvatar from "@/components/teble-avatar";
import { MonthsArray } from "@/consts";
import { useYear } from "@/store/year-store";
import { useKentDetail } from "./queries";
import formatPrice from "@/utils/formatPrice";
import ReportTotalsBar from "@/components/report-totals-bar";
import debounce from "@/utils/debounce";

const gridTemplate = "80px 60px 120px 120px 1fr 70px";

export default function KentDetailPage() {
  const { debtId } = useParams();
  const { year } = useYear();
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));
  const [typeFilter] = useQueryState("type", parseAsString);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [showSearch, setShowSearch] = useState(!!search);
  const [filterOpen, setFilterOpen] = useState(false);
  const [excelPending, setExcelPending] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

        {/* Sort */}
        <button className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask_sort_kd" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="1" y="3" width="16" height="12">
              <path d="M2.25 6.75L5.25 3.75M5.25 3.75L8.25 6.75M5.25 3.75V14.25M15.75 11.25L12.75 14.25M12.75 14.25L9.75 11.25M12.75 14.25V3.75" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </mask>
            <g mask="url(#mask_sort_kd)">
              <rect x="9" y="1" width="10" height="16" fill="#0078D4" />
              <rect x="-1" y="1" width="10" height="16" fill="#1A1A1A" />
            </g>
          </svg>
        </button>

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
                <p className="text-[13px] text-muted-foreground mb-1">Oy</p>
                <FilterSelect
                  placeholder="Oy tanlang"
                  className="w-full"
                  options={MonthsArray}
                  name="month"
                  defaultValue={String(new Date().getMonth() + 1)}
                />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground mb-1">Turi</p>
                <FilterSelect
                  placeholder="Hammasi"
                  className="w-full"
                  options={[
                    { label: "Hammasi", value: "clear" },
                    { label: "Olingan", value: "Приход" },
                    { label: "Qaytarilgan", value: "Расход" },
                  ]}
                  defaultValue="clear"
                  name="type"
                />
              </div>
              <Button variant="outline" onClick={clearFilters} className="w-full mt-2">
                Tozalash
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Excel */}
        <button
          onClick={handleExport}
          disabled={excelPending}
          className="w-[42px] h-[42px] rounded-[8px] bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {excelPending ? (
            <Loader className="w-[18px] h-[18px] animate-spin text-[#1A1A1A]" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip_excel_kd)">
                <path d="M10.3725 0.0113551L0.2925 1.92386C0.122344 1.9562 0 2.11089 0 2.28385V15.7164C0 15.8893 0.122344 16.044 0.2925 16.0764L10.3725 17.9889C10.395 17.9931 10.4175 18.0001 10.44 18.0001C10.523 18.0001 10.6003 17.9748 10.665 17.9214C10.748 17.8524 10.8 17.747 10.8 17.6401V0.360105C10.8 0.25323 10.748 0.147761 10.665 0.0788551C10.582 0.00994889 10.478 -0.00833238 10.3725 0.0113551ZM11.52 2.1601V4.6801H12.24V5.4001H11.52V7.2001H12.24V7.9201H11.52V9.7201H12.24V10.4401H11.52V12.6001H12.24V13.3201H11.52V15.8401H16.92C17.3166 15.8401 17.64 15.5167 17.64 15.1201V2.88011C17.64 2.48354 17.3166 2.1601 16.92 2.1601H11.52ZM12.96 4.6801H15.84V5.4001H12.96V4.6801ZM2.4075 5.6476H4.2525L5.22 7.66135C5.29594 7.82026 5.36344 8.01573 5.4225 8.2351H5.43375C5.47172 8.10432 5.54484 7.89901 5.6475 7.63885L6.71625 5.6476H8.40375L6.39 8.9776L8.46 12.3751H6.67125L5.50125 10.1814C5.45766 10.0998 5.41266 9.94932 5.36625 9.73135H5.355C5.3325 9.83401 5.27906 9.99432 5.1975 10.2039L4.0275 12.3751H2.2275L4.37625 9.01135L2.4075 5.6476ZM12.96 7.2001H15.84V7.9201H12.96V7.2001ZM12.96 9.7201H15.84V10.4401H12.96V9.7201ZM12.96 12.6001H15.84V13.3201H12.96V12.6001Z" fill="#1A1A1A" />
              </g>
              <defs>
                <clipPath id="clip_excel_kd">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
        </button>

        <ReportTotalsBar items={[
          { label: debt?.fullName, value: totals?.total_income || 0, color: "#FF6600" },
          { value: totals?.total_expense || 0, color: "#47B13C" },
          { value: debt?.totalDebt || 0, color: "#1a1a1a" },
        ]} />
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
