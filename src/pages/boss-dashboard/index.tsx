import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { RefreshCw } from "lucide-react";
import formatPrice from "@/utils/formatPrice";
import FilterRow from "./filter-row";
import CurrentMonthCard from "./current-month-card";
import ReportCardsGrid from "./report-cards-grid";
import { GraphIcon } from "./icons";
import {
  useCurrentMonthOverview,
  useYearlyTotal,
  useFilialsList,
} from "./queries";
import { useReportsHomePageCurrentLeft } from "@/pages/dashboard/queries";

export default function BossDashboard() {
  const [filialId] = useQueryState("filialId", parseAsString);
  const [month] = useQueryState("month", parseAsInteger.withDefault(new Date().getMonth() + 1));
  const [year] = useQueryState("year", parseAsInteger.withDefault(new Date().getFullYear()));

  // Filter LEFT section uchun (Joriy oy + Foyda/Xarajat/Qaytgan + kassa) — filialId, month, year
  const leftFilter = {
    filialId: filialId === "#dealers" ? undefined : filialId || undefined,
    month,
    year,
  };

  // RIGHT 9 cards — faqat year filterini qabul qiladi (filialId va month ta'sir qilmaydi)
  const generalFilter = { year } as const;

  const { data: currentMonthData, isLoading: currentMonthLoading } = useCurrentMonthOverview(leftFilter);
  const { data: yearlyData } = useYearlyTotal(year);
  const { data: leftData, isLoading: leftLoading } = useReportsHomePageCurrentLeft({
    queries: { year },
    enabled: true,
  });

  const { data: filialsResp } = useFilialsList();
  const filials: any[] = filialsResp?.items || filialsResp || [];
  const selectedFilialName =
    filialId === "#dealers"
      ? "Dillerlar"
      : filials.find((f) => f.id === filialId)?.title || filials.find((f) => f.id === filialId)?.name;

  const yearlyTotal = yearlyData?.totalSale ?? yearlyData?.totalSum;
  const yearlyProfit = yearlyData?.netProfitTotalSum ?? yearlyData?.additionalProfitTotalSum;

  return (
    <div className="h-full overflow-y-auto bg-[#f5f7f9] scrollCastom">
      {/*
        Inner grid (11 cols, mapping to outer cols 5-15):
        - Top bar: col-span-7 (cols 5-11)
        - Filter:  col-span-7 (cols 5-11)
        - Left:    col-span-5 (cols 5-9)
        - Right:   col-span-6 (cols 10-15) — pr-[15px]
        Mobile/tablet: stacks to 1 col
      */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-x-[16px]">
        {/* Top row: balance + refresh */}
        <div className="lg:col-span-7 flex items-center gap-[24px] flex-wrap">
          <div className="flex items-center gap-[8px]">
            <GraphIcon className="w-[36px] h-[36px] shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] text-[#1a1a1a] font-medium">
                {yearlyTotal != null ? `${formatPrice(yearlyTotal)} $` : "—"}
              </span>
              <span className="text-[13px] text-[#1a1a1a] font-normal">
                {yearlyProfit != null ? `${formatPrice(yearlyProfit)} $ umumiy foydasi` : ""}
              </span>
            </div>
          </div>

          <button className="flex items-center gap-[8px] hover:opacity-80 transition">
            <RefreshCw className="w-[36px] h-[36px] text-[#1a1a1a] shrink-0" strokeWidth={1.5} />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[15px] text-[#1a1a1a] font-medium">Yangilashni so'rash</span>
              <span className="text-[13px] text-[#1a1a1a] font-normal">
                Barcha kirim-chiqimlarni kiritishni so'rash
              </span>
            </div>
          </button>
        </div>

        {/* Filter row — 30px below top bar, 20px above Joriy oy */}
        <div className="lg:col-span-7 mt-[30px] mb-[20px]">
          <FilterRow />
        </div>

        {/* Left section */}
        <div className="lg:col-span-5">
          <CurrentMonthCard
            data={currentMonthData}
            isLoading={currentMonthLoading}
            filialName={selectedFilialName}
            month={month}
            year={year}
            filialId={filialId}
          />
        </div>

        {/* Right section — 9 cards (col 10-15, padding-left 15px). Filter ishlatilmaydi — har doim umumiy ma'lumot */}
        <div className="lg:col-span-6 lg:pl-[15px]">
          <ReportCardsGrid
            filter={generalFilter}
            inventoryData={leftData}
            isInventoryLoading={leftLoading}
          />
        </div>
      </div>
    </div>
  );
}
