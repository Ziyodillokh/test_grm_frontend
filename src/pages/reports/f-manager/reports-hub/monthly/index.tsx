import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ListRow } from "@/components/ui/list-row";
import { Loader } from "lucide-react";
import { useYear } from "@/store/year-store";
import { useMeStore } from "@/store/me-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { MonthsArray } from "@/consts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReportTotals from "../../../m-manager/report-finance/monthly/report-totals";
import { TKassareportData } from "../../../m-manager/report-finance/type";
import { useDataKassa } from "../../report/queries";
import { useKassaTotals } from "./queries";
import TebleAvatar from "@/components/teble-avatar";

export default function MonthlyReportsPage() {
  const { meUser } = useMeStore();
  const { year, setYear } = useYear();
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);
  const filialId = meUser?.filial?.id;

  const { data: kassaData, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useDataKassa({
    queries: {
      filial: filialId || undefined,
      year,
    },
    enabled: Boolean(filialId),
  });

  const { data: totals } = useKassaTotals({
    queries: { filialId: filialId || "", year },
    enabled: Boolean(filialId),
  });

  const flatData = kassaData?.pages?.flatMap((page) => page?.items || []) || [];

  // Infinite scroll trigger
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const gridTemplate = "4px 80px 60px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
  const columnLabels = ["", "Saldo", "", "Oy", "Savdo", "Qarz", "Terminal", "Inkassa", "Hajm", "Foyda", "Chegirma"];

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="flex flex-col h-full">
      <ReportTotals data={totals as TKassareportData} showDebtLabel />

      {/* Toolbar */}
      <div className="flex items-center gap-[4px] shrink-0 mt-[10px]">
        {/* Filter (year) */}
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <button className="relative w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 3H2.25M9.75 12H5.25M8.25 15H11.25M4.5 6H15M3 9H12" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {year !== currentYear && (
                <span className="absolute top-[8px] right-[8px] w-[6px] h-[6px] rounded-full bg-[#0078D4]" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[200px] p-[12px] bg-[#f5f7f9] border border-[#e7ebf0] rounded-[6px] shadow-[0px_12px_24px_0px_rgba(12,36,58,0.08)]"
          >
            <p className="text-[15px] font-medium text-[#1a1a1a] px-[4px] mb-[10px]">Yil</p>
            <div className="flex flex-col gap-[4px]">
              {yearOptions.map((y) => (
                <button
                  key={y}
                  onClick={() => { setYear(y); setFilterOpen(false); }}
                  className={`text-left px-[12px] py-[8px] rounded-[6px] text-[14px] transition-colors ${y === year ? "bg-[#0078D4] text-white" : "bg-white hover:bg-gray-50 text-[#1a1a1a]"}`}
                >
                  {y}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <span className="text-[13px] text-[#A3A3A3] ml-[8px]">Yil: <b className="text-[#1a1a1a]">{year}</b></span>
      </div>

      {/* Labellar */}
      <div
        className="mt-[20px] mb-[10px] shrink-0 px-[12px]"
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: "8px" }}
      >
        {columnLabels.map((label, i) => (
          <span key={i} className={`text-[13px] text-[#A3A3A3] ${label === "Saldo" ? "text-center" : ""}`}>{label}</span>
        ))}
      </div>

      {/* Listlar */}
      <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader className="w-6 h-6 animate-spin text-[#a3a3a3]" />
          </div>
        ) : (
          <>
            {flatData.map((item: any, i: number) => (
              <MonthlyRow key={item?.id || i} item={item} gridTemplate={gridTemplate} onRowClick={(item) => {
                if (item?.id) {
                  const monthLabel = item?.month ? MonthsArray[item.month - 1]?.label : "Kassa";
                  push(monthLabel || "Kassa", `/f-manager/reports-hub/monthly/${item.id}`);
                  navigate(`/f-manager/reports-hub/monthly/${item.id}`);
                }
              }} />
            ))}
            <div ref={loadMoreRef} className="h-[20px] flex items-center justify-center">
              {isFetchingNextPage && <Loader className="w-4 h-4 animate-spin text-[#a3a3a3]" />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function getRowStatus(item: any): { barColor: string; showBar: boolean } {
  if (item?.status === "accepted") {
    return { barColor: "transparent", showBar: false };
  }
  if (item?.status === "closed" || item?.status === "closed_by_d") {
    return { barColor: "#FFA91E", showBar: true };
  }
  if (item?.status === "warning") {
    return { barColor: "#3ABC49", showBar: true };
  }
  return { barColor: "#3ABC49", showBar: true };
}

function MonthlyRow({ item, onRowClick, gridTemplate }: { item: any; onRowClick: (item: any) => void; gridTemplate: string }) {
  const { meUser } = useMeStore();

  const saldo = item?.inHand || 0;
  const monthName = item?.month ? MonthsArray[item.month - 1]?.label : "—";
  const sale = item?.sale ?? item?.totalSale ?? 0;
  const terminal = item?.plasticSum ?? item?.totalPlasticSum ?? 0;
  const debt = item?.debtSum ?? 0;
  const inkassa = item?.cashCollection ?? item?.totalCashCollection ?? 0;
  const hajm = item?.saleSize ?? item?.totalSaleSize ?? item?.totalSize ?? 0;
  const foyda = item?.additionalProfitSum ?? item?.totalAdditionalProfitSum ?? 0;
  const chegirma = Number(item?.discountSum ?? item?.totalDiscountSum ?? item?.discount ?? item?.totalDiscount ?? 0);

  const rowStatus = getRowStatus(item);

  return (
    <ListRow
      gridTemplate={gridTemplate}
      onClick={() => onRowClick(item)}
    >
      {/* Tayoqcha */}
      {rowStatus.showBar ? (
        <div className="w-[2px] h-[30px] rounded-full" style={{ backgroundColor: rowStatus.barColor }} />
      ) : (
        <div />
      )}

      {/* Saldo */}
      <span className={`text-[15px] font-medium whitespace-nowrap text-right ${saldo === 0 ? "text-[#1a1a1a]" : saldo > 0 ? "text-[#1a1a1a]" : "text-[#EF5C12]"}`}>
        {saldo === 0 ? "0$" : saldo > 0 ? `+${saldo.toLocaleString()}$` : `${saldo.toLocaleString()}$`}
      </span>

      {/* Avatar — F-manager */}
      <div className="flex items-center justify-center">
        <TebleAvatar
          size={42}
          status={item?.status === "accepted" ? "success" : item?.status === "closed" ? "panding" : "none"}
          url={meUser?.avatar?.path}
          name={meUser?.firstName || ""}
        />
      </div>

      {/* Oy */}
      <span className="text-[13px] font-medium text-[#1a1a1a]">{monthName}</span>

      {/* Savdo */}
      <span className="text-[13px] text-[#1a1a1a]">{sale ? `${sale.toLocaleString()}$` : "0$"}</span>

      {/* Qarz */}
      <span className="text-[13px] text-[#1a1a1a]">{debt ? `${debt.toLocaleString()}$` : "0$"}</span>

      {/* Terminal */}
      <span className="text-[13px] text-[#0078D4]">{terminal ? `${terminal.toLocaleString()}$` : "0$"}</span>

      {/* Inkassa */}
      <span className="text-[13px] text-[#1a1a1a]">{inkassa ? `${inkassa.toLocaleString()}$` : "0$"}</span>

      {/* Hajm */}
      <span className="text-[13px] text-[#1a1a1a]">{hajm ? `${hajm.toFixed(0)} m²` : "0 m²"}</span>

      {/* Foyda */}
      <span className="text-[13px] text-[#47B13C]">{foyda ? `+${foyda.toLocaleString()}$` : "0$"}</span>

      {/* Chegirma */}
      <span className="text-[13px] text-[#EC6724]">{chegirma ? `-${Math.abs(chegirma).toLocaleString()}$` : "0$"}</span>
    </ListRow>
  );
}
