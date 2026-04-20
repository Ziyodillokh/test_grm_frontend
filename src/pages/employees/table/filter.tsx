import { useState, useRef } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { X } from "lucide-react";
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
import { useMeStore } from "@/store/me-store";
import { usefilialWarehouseFetch } from "@/pages/reports/m-manager/remaider/queries";
import debounce from "@/utils/debounce";

export default function UserFilter() {
  const { meUser } = useMeStore();
  const role = meUser?.position?.role ?? 0;
  const isManager = role >= 9;

  const [search, setSearch] = useQueryState("search", parseAsString);
  const [, setId] = useQueryState("id", parseAsString);
  const [showSearch, setShowSearch] = useState(!!search);
  const [filterOpen, setFilterOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: filialData } = usefilialWarehouseFetch({
    queries: { limit: 50 },
    options: { enabled: isManager } as any,
  });
  const filialOptions =
    filialData?.pages?.[0]?.items?.map((e: any) => ({
      label: e?.name || e?.title,
      value: e?.id,
    })) || [];

  const clearFilters = () => {
    setSearch(null);
    setFilterOpen(false);
  };

  return (
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
          <mask id="mask_sort_user" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="1" y="3" width="16" height="12">
            <path d="M2.25 6.75L5.25 3.75M5.25 3.75L8.25 6.75M5.25 3.75V14.25M15.75 11.25L12.75 14.25M12.75 14.25L9.75 11.25M12.75 14.25V3.75" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </mask>
          <g mask="url(#mask_sort_user)">
            <rect x="9" y="1" width="10" height="16" fill="#0078D4" />
            <rect x="-1" y="1" width="10" height="16" fill="#1A1A1A" />
          </g>
        </svg>
      </button>

      {/* Filter — faqat M-manager uchun */}
      {isManager && (
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
                <p className="text-[13px] text-muted-foreground mb-1">Filial</p>
                <FilterSelect
                  placeholder="Barcha filiallar"
                  className="w-full"
                  options={[{ value: "all", label: "Barchasi" }, ...filialOptions]}
                  name="filial"
                />
              </div>

              <Button variant="outline" onClick={clearFilters} className="w-full mt-2">
                Tozalash
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Qo'shish — faqat HR */}
      {role === 11 && (
        <button
          onClick={() => setId("new")}
          className="ml-auto h-[42px] px-[16px] rounded-[8px] bg-[#0078D4] text-white text-[13px] font-medium hover:bg-[#006CBE] transition-colors shrink-0"
        >
          + Qo'shish
        </button>
      )}
    </div>
  );
}
