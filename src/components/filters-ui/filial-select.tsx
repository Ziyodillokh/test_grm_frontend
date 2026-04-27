import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FilialIcon } from "@/components/icons/filial-icon";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

interface Filial {
  id: string;
  title?: string;
  name?: string;
  type?: string;
}

interface FilialSelectProps {
  /** Hozir tanlangan filial id (yoki maxsus qiymat — '#dealers', '#all') */
  value?: string | null;
  onChange: (id: string | null) => void;
  /** Bo'sh holatdagi placeholder, ko'k rangda ko'rinadi (masalan "...dan", "...ga") */
  placeholder?: string;
  /** Hech qaysi tanlanmaganda label sifatida ko'rinadigan default text. Agar bo'lsa, placeholder o'rniga shu ko'rinadi (oq) */
  emptyLabel?: string;
  /** Tashqi filiallar ro'yxati. Agar berilmasa, /filial endpoint orqali olinadi */
  filials?: Filial[];
  /** Maxsus opsiyalar — "Barchasi" yoki "Dillerlar" kabi */
  showAllOption?: boolean;
  showDealersOption?: boolean;
  /** Bu id'larni disabled qilib qo'yadi (boshqa tanlovga teng) */
  disabledIds?: string[];
  /** Filterlash uchun type (default: filial) */
  filialTypes?: string[];
  className?: string;
  popoverWidth?: number;
  /** Trigger ichidagi icon o'rnida boshqa icon ko'rsatish (default: FilialIcon). Sahifa-specific override uchun. */
  icon?: React.ReactNode;
  /** Trigger eni — default 200px */
  width?: number;
}

/**
 * Reusable filial selektor (Umumiy Hisobot uslubi).
 * Trigger: [icon] Filial [value/placeholder] [chevron] — 34px tall, 4px radius.
 */
export function FilialSelect({
  value,
  onChange,
  placeholder = "...dan",
  emptyLabel,
  filials,
  showAllOption = false,
  showDealersOption = false,
  disabledIds = [],
  filialTypes,
  className,
  popoverWidth = 240,
  icon,
  width = 200,
}: FilialSelectProps) {
  const { data: fetched } = useQuery({
    queryKey: [apiRoutes.filial, "filial-select", filialTypes],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.filial, { limit: 200, page: 1 }),
    enabled: !filials,
  });

  const allFilials: Filial[] =
    filials || (fetched?.items as Filial[]) || (fetched as Filial[]) || [];
  const list = filialTypes
    ? allFilials.filter((f) => f.type && filialTypes.includes(f.type))
    : allFilials;

  let displayLabel: string | null = null;
  if (value === "#all") {
    displayLabel = "Barchasi";
  } else if (value === "#dealers") {
    displayLabel = "Dillerlar";
  } else if (value) {
    const sel = allFilials.find((f) => f.id === value);
    displayLabel = sel ? sel.title || sel.name || "" : null;
  }
  if (!displayLabel) {
    displayLabel = emptyLabel || placeholder;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          style={{ width }}
          className={`flex items-center gap-[6px] h-[42px] px-[12px] border border-[#e7ebf0] rounded-[6px] transition-colors ${value ? "bg-white" : "bg-transparent"} ${className || ""}`}
        >
          <span className="w-[16px] h-[16px] flex items-center justify-center shrink-0 text-[#1a1a1a]">
            {icon || <FilialIcon className="w-[16px] h-[16px]" />}
          </span>
          <span className="text-[13px] font-medium text-[#1a1a1a]">Filial</span>
          <span className="text-[13px] font-medium ml-[2px] flex-1 text-left truncate text-[#0078d4]">
            {displayLabel}
          </span>
          <ChevronDown className="w-[14px] h-[14px] text-[#1a1a1a] shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        style={{ width: popoverWidth }}
        className="p-[4px] max-h-[320px] overflow-y-auto scrollCastom"
      >
        {showAllOption && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${!value ? "bg-[#f5f7f9] font-medium" : ""}`}
          >
            Barchasi
          </button>
        )}
        {showDealersOption && (
          <button
            type="button"
            onClick={() => onChange("#dealers")}
            className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${value === "#dealers" ? "bg-[#f5f7f9] font-medium" : ""}`}
          >
            Dillerlar
          </button>
        )}
        {(showAllOption || showDealersOption) && list.length > 0 && (
          <div className="h-[1px] bg-[#e8eef3] my-[4px]" />
        )}
        {list.map((f) => {
          const isDisabled = disabledIds.includes(f.id);
          return (
            <button
              key={f.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(f.id)}
              className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] disabled:opacity-40 disabled:cursor-not-allowed ${
                value === f.id ? "bg-[#f5f7f9] font-medium" : ""
              }`}
            >
              {f.title || f.name}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
