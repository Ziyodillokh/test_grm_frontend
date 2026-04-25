import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { RefreshCw } from "lucide-react";
import formatPrice from "@/utils/formatPrice";
import { useYear } from "@/store/year-store";
import FilterRow from "./filter-row";
import CurrentMonthCard from "./current-month-card";
import ReportCardsGrid from "./report-cards-grid";
import { GraphIcon } from "./icons";
import {
  useMonthlyV2,
  useCurrentMonthOverview,
  useYearlyTotal,
  useFilialsList,
} from "./queries";
import { useReportsHomePageCurrentLeft } from "@/pages/dashboard/queries";

export default function BossDashboard() {
  // URL state — Umumiy Hisobot bilan bir xil keylar (filial, month)
  const [filial] = useQueryState("filial", parseAsString);
  const [month] = useQueryState("month", parseAsInteger.withDefault(new Date().getMonth() + 1));
  // Year — Zustand store (Umumiy Hisobot bilan shared)
  const { year } = useYear();

  // LEFT — filterlar bilan (filial+month+year)
  const leftFilter = {
    filialId: filial === "#dealers" ? "#dealers" : filial || undefined,
    month,
    year,
  };

  // RIGHT — faqat year filteri (umumiy ma'lumot)
  const generalFilter = { year } as const;

  // Asosiy data — monthly/v2 (Umumiy Hisobot bilan bir xil)
  const { data: leftData, isLoading: leftLoading } = useMonthlyV2(leftFilter);

  // Yearly balance (top right)
  const { data: yearlyData } = useYearlyTotal(year);

  // Inventory ("Qoldiq" card uchun)
  const { data: inventoryData, isLoading: inventoryLoading } = useReportsHomePageCurrentLeft({
    queries: { year },
    enabled: true,
  });

  // Manager/Accountant kassa progress uchun — eski endpoint
  const { data: kassaData } = useCurrentMonthOverview(leftFilter);

  // Filiallar
  const { data: filialsResp } = useFilialsList();
  const filials: any[] = filialsResp?.items || filialsResp || [];
  const selectedFilialName =
    filial === "#dealers"
      ? "Dillerlar"
      : filials.find((f) => f.id === filial)?.title || filials.find((f) => f.id === filial)?.name;

  const yearlyTotal = yearlyData?.totalSale ?? yearlyData?.totalSum;
  const yearlyProfit = yearlyData?.netProfitTotalSum ?? yearlyData?.additionalProfitTotalSum;

  return (
    <div className="h-full overflow-y-auto bg-[#f5f7f9] scrollCastom">
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

        {/* Filter row */}
        <div className="lg:col-span-7 mt-[30px] mb-[20px]">
          <FilterRow />
        </div>

        {/* Left section */}
        <div className="lg:col-span-5">
          <CurrentMonthCard
            data={leftData}
            kassaData={kassaData}
            isLoading={leftLoading}
            filialName={selectedFilialName}
            month={month}
            year={year}
            filial={filial}
          />
        </div>

        {/* Right section — 9 cards */}
        <div className="lg:col-span-6 lg:pl-[15px]">
          <ReportCardsGrid
            filter={generalFilter}
            inventoryData={inventoryData}
            isInventoryLoading={inventoryLoading}
          />
        </div>
      </div>
    </div>
  );
}
