import { useState, useRef } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { X, Loader, Eraser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PrimaryButton } from "@/components/ui/primary-button";
import ReportTotalsBar, { TotalItem } from "@/components/report-totals-bar";
import debounce from "@/utils/debounce";

interface ReportToolbarProps {
  filterContent?: React.ReactNode;
  totalsItems?: TotalItem[];
  onExport?: () => void;
  excelPending?: boolean;
  beforeIcons?: React.ReactNode;
  /** O'ng tomonda ko'rinadigan action buttonlar (masalan "Qo'shish") */
  actions?: React.ReactNode;
  /** Sort popover ichidagi kontent (figma "Sort by" popup uchun) */
  sortContent?: React.ReactNode;
  /** Filter active bo'lsa tugma yonida ko'k aylana ko'rinadi */
  hasActiveFilter?: boolean;
  /** Filter active bo'lsa popover ichida "Tozalash" button ko'rsatadi va shu callback chaqiriladi */
  onClearFilters?: () => void;
  /** Toolbar iconlaridan 30px o'ngda inline ko'rinadigan elementlar (masalan filial selektorlar) */
  inlineControls?: React.ReactNode;
}

export default function ReportToolbar({
  filterContent,
  totalsItems,
  onExport,
  excelPending,
  beforeIcons,
  actions,
  sortContent,
  hasActiveFilter,
  onClearFilters,
  inlineControls,
}: ReportToolbarProps) {
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [showSearch, setShowSearch] = useState(!!search);
  const [filterOpen, setFilterOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-[4px] shrink-0 pt-0 px-0 pb-[20px]">
      {beforeIcons}

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
          className="w-[42px] h-[42px] rounded-sm bg-transparent flex items-center justify-center shrink-0 hover:bg-white/50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.7508 15.7508L12.4883 12.4883" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Sort */}
      {sortContent ? (
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-[42px] h-[42px] rounded-sm bg-transparent flex items-center justify-center shrink-0 hover:bg-white/50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask_sort_rt" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="1" y="3" width="16" height="12">
                  <path d="M2.25 6.75L5.25 3.75M5.25 3.75L8.25 6.75M5.25 3.75V14.25M15.75 11.25L12.75 14.25M12.75 14.25L9.75 11.25M12.75 14.25V3.75" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </mask>
                <g mask="url(#mask_sort_rt)">
                  <rect x="9" y="1" width="10" height="16" fill="#0078D4" />
                  <rect x="-1" y="1" width="10" height="16" fill="#1A1A1A" />
                </g>
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[330px] p-[8px] bg-[#f5f7f9] border border-[#e7ebf0] rounded-[6px] shadow-[0px_12px_24px_0px_rgba(12,36,58,0.08)]"
          >
            {sortContent}
          </PopoverContent>
        </Popover>
      ) : (
        <button className="w-[42px] h-[42px] rounded-sm bg-transparent flex items-center justify-center shrink-0 hover:bg-white/50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask_sort_rt" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="1" y="3" width="16" height="12">
              <path d="M2.25 6.75L5.25 3.75M5.25 3.75L8.25 6.75M5.25 3.75V14.25M15.75 11.25L12.75 14.25M12.75 14.25L9.75 11.25M12.75 14.25V3.75" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </mask>
            <g mask="url(#mask_sort_rt)">
              <rect x="9" y="1" width="10" height="16" fill="#0078D4" />
              <rect x="-1" y="1" width="10" height="16" fill="#1A1A1A" />
            </g>
          </svg>
        </button>
      )}

      {/* Filter — icon doim ko'rinadi, popup faqat filterContent berilganida chiqadi */}
      <Popover open={filterOpen} onOpenChange={(o) => filterContent && setFilterOpen(o)}>
        <PopoverTrigger asChild>
          <button
            className={`relative w-[42px] h-[42px] rounded-sm flex items-center justify-center shrink-0 transition-colors ${
              hasActiveFilter ? "bg-white hover:bg-white" : "bg-transparent hover:bg-white/50"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.75 3H2.25M9.75 12H5.25M8.25 15H11.25M4.5 6H15M3 9H12" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {hasActiveFilter && (
              <span className="absolute top-[5px] right-[5px] w-[6px] h-[6px] rounded-full bg-[#e5484d]" />
            )}
          </button>
        </PopoverTrigger>
        {filterContent && (
          <PopoverContent
            align="start"
            sideOffset={8}
            className="w-[580px] p-0 bg-[#f5f7f9] border border-[#e7ebf0] rounded-[6px] shadow-[0px_12px_24px_0px_rgba(12,36,58,0.08)] z-[40] overflow-hidden"
          >
            {/* Header: filter icon + "Filter" + X close */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px] py-[10px] pl-[12px]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 3.33301H2.5M10.8333 13.333H6.66667M9.16667 16.6663H12.5M5 6.66634H16.6667M3.33333 9.99967H13.3333" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[15px] font-medium text-[#1a1a1a] leading-none">Filter</span>
              </div>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="py-[10px] pr-[12px] pl-[12px] flex items-center justify-center"
                aria-label="Yopish"
              >
                <X className="w-[20px] h-[20px] text-[#1a1a1a]" strokeWidth={1.4} />
              </button>
            </div>
            {/* Divider */}
            <div className="h-[1px] bg-[#e7ebf0]" />
            {/* Body — 20px gap below line, 40px horizontal padding, 2-col grid (input 240px) */}
            <div className="pt-[20px] px-[40px] pb-[20px] grid grid-cols-2 gap-x-[20px] gap-y-[16px]">
              {filterContent}
              {/* Filterni tozalash button — faqat filter active bo'lganda */}
              {hasActiveFilter && onClearFilters && (
                <div className="col-span-2 flex justify-start">
                  <PrimaryButton onClick={onClearFilters} icon={<Eraser />}>
                    Filterni tozalash
                  </PrimaryButton>
                </div>
              )}
            </div>
          </PopoverContent>
        )}
      </Popover>

      {/* Excel */}
      <button
        onClick={onExport}
        disabled={excelPending}
        className="w-[42px] h-[42px] rounded-sm bg-transparent flex items-center justify-center shrink-0 hover:bg-white/50 transition-colors disabled:opacity-50"
      >
        {excelPending ? (
          <Loader className="w-[18px] h-[18px] animate-spin text-[#1A1A1A]" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip_excel_rt)">
              <path d="M10.3725 0.0113551L0.2925 1.92386C0.122344 1.9562 0 2.11089 0 2.28385V15.7164C0 15.8893 0.122344 16.044 0.2925 16.0764L10.3725 17.9889C10.395 17.9931 10.4175 18.0001 10.44 18.0001C10.523 18.0001 10.6003 17.9748 10.665 17.9214C10.748 17.8524 10.8 17.747 10.8 17.6401V0.360105C10.8 0.25323 10.748 0.147761 10.665 0.0788551C10.582 0.00994889 10.478 -0.00833238 10.3725 0.0113551ZM11.52 2.1601V4.6801H12.24V5.4001H11.52V7.2001H12.24V7.9201H11.52V9.7201H12.24V10.4401H11.52V12.6001H12.24V13.3201H11.52V15.8401H16.92C17.3166 15.8401 17.64 15.5167 17.64 15.1201V2.88011C17.64 2.48354 17.3166 2.1601 16.92 2.1601H11.52ZM12.96 4.6801H15.84V5.4001H12.96V4.6801ZM2.4075 5.6476H4.2525L5.22 7.66135C5.29594 7.82026 5.36344 8.01573 5.4225 8.2351H5.43375C5.47172 8.10432 5.54484 7.89901 5.6475 7.63885L6.71625 5.6476H8.40375L6.39 8.9776L8.46 12.3751H6.67125L5.50125 10.1814C5.45766 10.0998 5.41266 9.94932 5.36625 9.73135H5.355C5.3325 9.83401 5.27906 9.99432 5.1975 10.2039L4.0275 12.3751H2.2275L4.37625 9.01135L2.4075 5.6476ZM12.96 7.2001H15.84V7.9201H12.96V7.2001ZM12.96 9.7201H15.84V10.4401H12.96V9.7201ZM12.96 12.6001H15.84V13.3201H12.96V12.6001Z" fill="#1A1A1A" />
            </g>
            <defs>
              <clipPath id="clip_excel_rt">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )}
      </button>

      {/* Inline controls — toolbar iconlaridan 30px o'ngda (filial pickers va h.k.) */}
      {inlineControls && (
        <div className="ml-[30px] flex items-center gap-[15px]">{inlineControls}</div>
      )}

      {/* Totals */}
      {totalsItems && <ReportTotalsBar items={totalsItems} />}

      {/* Right-side actions */}
      {actions && <div className="ml-auto flex items-center gap-[4px]">{actions}</div>}
    </div>
  );
}
