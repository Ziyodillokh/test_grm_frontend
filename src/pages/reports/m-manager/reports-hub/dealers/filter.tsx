import { useState, useRef } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import FilterSelect from "@/components/filters-ui/filter-select";
import debounce from "@/utils/debounce";
import { MonthsArray } from "@/consts";
import ReportTotalsBar from "@/components/report-totals-bar";
import { DealerReportTotals } from "./type";

const yearsArray = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { label: String(y), value: String(y) };
});

export default function DealerFilter({
  totals,
}: {
  totals?: DealerReportTotals;
}) {
  const [yearFilter] = useQueryState("year", parseAsString.withDefault(String(new Date().getFullYear())));
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [showSearch, setShowSearch] = useState(!!search);
  const [filterOpen, setFilterOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const clearFilters = () => {
    setSearch(null);
    setFilterOpen(false);
  };

  return (
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
          <mask id="mask_sort_dealer" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="1" y="3" width="16" height="12">
            <path d="M2.25 6.75L5.25 3.75M5.25 3.75L8.25 6.75M5.25 3.75V14.25M15.75 11.25L12.75 14.25M12.75 14.25L9.75 11.25M12.75 14.25V3.75" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </mask>
          <g mask="url(#mask_sort_dealer)">
            <rect x="9" y="1" width="10" height="16" fill="#0078D4" />
            <rect x="-1" y="1" width="10" height="16" fill="#1A1A1A" />
          </g>
        </svg>
      </button>

      {/* Filter */}
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <button className="relative w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.75 3H2.25M9.75 12H5.25M8.25 15H11.25M4.5 6H15M3 9H12" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {!!search && (
              <span className="absolute top-[8px] right-[8px] w-[6px] h-[6px] rounded-full bg-[#0078D4]" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[330px] p-[12px] bg-[#f5f7f9] border border-[#e7ebf0] rounded-[12px] shadow-[0px_12px_24px_0px_rgba(12,36,58,0.08)] z-[40]"
        >
          <p className="text-[15px] font-medium text-[#1a1a1a] px-[4px] mb-[10px]">Filter</p>
          <div className="flex flex-col gap-[10px]">
            <div>
              <p className="text-[12px] text-[#A3A3A3] mb-[4px] px-[4px]">Yil</p>
              <div className="bg-white rounded-[8px]">
                <FilterSelect
                  placeholder="Yil tanlang"
                  className="w-full"
                  classNameContainer="z-[60]"
                  options={yearsArray}
                  name="year"
                  defaultValue={yearFilter}
                />
              </div>
            </div>
            <div>
              <p className="text-[12px] text-[#A3A3A3] mb-[4px] px-[4px]">Oy</p>
              <div className="bg-white rounded-[8px]">
                <FilterSelect
                  placeholder="Oy tanlang"
                  className="w-full"
                  classNameContainer="z-[60]"
                  options={MonthsArray}
                  name="month"
                  defaultValue={String(new Date().getMonth() + 1)}
                />
              </div>
            </div>
            <Button variant="outline" onClick={clearFilters} className="w-full mt-2">
              Tozalash
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <ReportTotalsBar items={[
        { label: "Umumiy:", value: totals?.total_owed || 0, color: "#FF6600" },
        { value: totals?.total_given || 0, color: "#47B13C" },
        { value: totals?.total_debt || 0, color: "#1a1a1a" },
      ]} />
    </div>
  );
}
