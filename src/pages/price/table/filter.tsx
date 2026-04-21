import { useState, useRef } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import debounce from "@/utils/debounce";

export default function PriceFilter({ children, hideTabs }: { children?: React.ReactNode; hideTabs?: boolean }) {
  const navigate = useNavigate();
  const pathName = useLocation().pathname;

  const [search, setSearch] = useQueryState("search", parseAsString);
  const [showSearch, setShowSearch] = useState(!!search);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
          <mask id="mask_sort_price" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="1" y="3" width="16" height="12">
            <path d="M2.25 6.75L5.25 3.75M5.25 3.75L8.25 6.75M5.25 3.75V14.25M15.75 11.25L12.75 14.25M12.75 14.25L9.75 11.25M12.75 14.25V3.75" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </mask>
          <g mask="url(#mask_sort_price)">
            <rect x="9" y="1" width="10" height="16" fill="#0078D4" />
            <rect x="-1" y="1" width="10" height="16" fill="#1A1A1A" />
          </g>
        </svg>
      </button>

      {/* Tabs */}
      {!hideTabs && (
        <div className="flex items-center gap-[2px] bg-white rounded-sm px-[4px] h-[42px]">
          <Button
            variant="ghost"
            size="sm"
            className={`h-[34px] rounded-sm text-[13px] ${pathName === "/price" ? "bg-[#F5F5F5] font-medium" : ""}`}
            onClick={() => navigate("/price")}
          >
            Narxlar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-[34px] rounded-sm text-[13px] ${pathName === "/discount" ? "bg-[#F5F5F5] font-medium" : ""}`}
            onClick={() => navigate("/discount")}
          >
            Chegirmalar
          </Button>
        </div>
      )}

      {children}
    </div>
  );
}
