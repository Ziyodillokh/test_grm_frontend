import { Calendar, ChevronDown } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useYear } from "@/store/year-store";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { FilialIcon } from "@/components/icons/filial-icon";

const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

const yearsList = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

interface BossFilterRowProps {
  /** Default month if URL not set */
  defaultMonth?: number;
  /** Hide filial picker (e.g. for F-manager) */
  hideFilial?: boolean;
  /** Children rendered after filters (e.g. Excel button) */
  children?: React.ReactNode;
}

/**
 * Shared filter row used by Boss Dashboard and Umumiy Hisobot.
 * URL keys: 'filial', 'month'. Year via Zustand `useYear()`.
 */
export default function BossFilterRow({
  defaultMonth = new Date().getMonth() + 1,
  hideFilial = false,
  children,
}: BossFilterRowProps) {
  const [filial, setFilial] = useQueryState("filial", parseAsString);
  const [month, setMonth] = useQueryState("month", parseAsInteger.withDefault(defaultMonth));
  const { year, setYear } = useYear();

  const { data: filialsResp } = useQuery({
    queryKey: [apiRoutes.filial, "boss-filter"],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.filial, { type: "filial", limit: 200, page: 1 }),
    enabled: !hideFilial,
  });
  const filials: any[] = filialsResp?.items || filialsResp || [];

  let filialLabel = "Barchasi";
  if (filial === "#dealers") {
    filialLabel = "Dillerlar";
  } else if (filial) {
    const selectedFilial = filials.find((f: any) => f.id === filial);
    if (selectedFilial) filialLabel = selectedFilial.title || selectedFilial.name;
  }
  const monthLabel = MONTHS[(month || 1) - 1];

  return (
    <div className="flex items-center gap-[8px]">
      {!hideFilial && (
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-[4px] h-[34px] px-[12px] bg-[#f5f7f9] border border-[#dfe6ed] rounded-[4px]">
              <FilialIcon className="w-[16px] h-[16px]" />
              <span className="text-[13px] font-medium text-[#1a1a1a]">Filial</span>
              <span className="text-[13px] font-medium text-[#1a1a1a] ml-[8px]">{filialLabel}</span>
              <ChevronDown className="w-[12px] h-[12px] text-[#1a1a1a] ml-[4px]" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-[4px]" align="start">
            <button
              onClick={() => setFilial(null)}
              className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${!filial ? "bg-[#f5f7f9] font-medium" : ""}`}
            >
              Barchasi
            </button>
            <button
              onClick={() => setFilial("#dealers")}
              className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${filial === "#dealers" ? "bg-[#f5f7f9] font-medium" : ""}`}
            >
              Dillerlar
            </button>
            <div className="h-[1px] bg-[#e8eef3] my-[4px]" />
            {filials.map((f: any) => (
              <button
                key={f.id}
                onClick={() => setFilial(f.id)}
                className={`w-full text-left px-[12px] py-[8px] text-[13px] rounded-[4px] hover:bg-[#f5f7f9] ${filial === f.id ? "bg-[#f5f7f9] font-medium" : ""}`}
              >
                {f.title || f.name}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-[4px] h-[34px] px-[12px] bg-[#f5f7f9] border border-[#dfe6ed] rounded-[4px]">
            <Calendar className="w-[14px] h-[14px] text-[#1a1a1a]" />
            <span className="text-[13px] font-medium text-[#1a1a1a]">Davr</span>
            <span className="text-[13px] font-medium text-[#1a1a1a] ml-[8px]">
              {monthLabel} {year}
            </span>
            <ChevronDown className="w-[12px] h-[12px] text-[#1a1a1a] ml-[4px]" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-[8px]" align="start">
          <div className="flex gap-[4px] mb-[6px] flex-wrap">
            {yearsList.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-[10px] h-[28px] text-[12px] rounded-[4px] ${year === y ? "bg-[#1a1a1a] text-white" : "bg-[#f5f7f9] text-[#1a1a1a] hover:bg-[#e8eef3]"}`}
              >
                {y}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-[4px]">
            {MONTHS.map((m, i) => (
              <button
                key={m}
                onClick={() => setMonth(i + 1)}
                className={`h-[30px] text-[12px] rounded-[4px] ${month === i + 1 ? "bg-[#0078d4] text-white" : "bg-[#f5f7f9] text-[#1a1a1a] hover:bg-[#e8eef3]"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {children}
    </div>
  );
}
