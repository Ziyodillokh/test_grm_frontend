import formatPrice from "@/utils/formatPrice";
import ReportCard from "./report-card";
import {
  useCurrentMonthOverview,
  useDealerCardTotals,
  useFactoryCardTotals,
  useLogisticsCardTotals,
  useCustomsCardTotals,
  useKentsCardTotals,
  useClientDebtTotal,
  BossDashboardFilter,
} from "./queries";

const fmt = (v: number | undefined) => `${formatPrice(Number(v || 0))} $`;

interface Props {
  /** General filter for cards — faqat yearga ta'sir qiladi, month/filialId emas */
  filter: Pick<BossDashboardFilter, "year">;
  inventoryData?: any;
  isInventoryLoading?: boolean;
}

export default function ReportCardsGrid({
  filter,
  inventoryData,
  isInventoryLoading,
}: Props) {
  // Right grid har doim umumiy ma'lumot ko'rsatadi (filialId va month yo'q, faqat year)
  const generalFilter = { year: filter.year };

  const { data: monthlyData, isLoading: monthlyLoading } = useCurrentMonthOverview(generalFilter);
  const { data: dealerData, isLoading: dealerLoading } = useDealerCardTotals(generalFilter);
  const { data: factoryData, isLoading: factoryLoading } = useFactoryCardTotals(generalFilter);
  const { data: logisticsData, isLoading: logisticsLoading } = useLogisticsCardTotals(generalFilter);
  const { data: customsData, isLoading: customsLoading } = useCustomsCardTotals(generalFilter);
  const { data: kentsData, isLoading: kentsLoading } = useKentsCardTotals(generalFilter);
  const { data: clientDebtData, isLoading: clientDebtLoading } = useClientDebtTotal();

  const dealerTotals = dealerData?.totals || {};
  const factoryTotals = factoryData?.totals || factoryData || {};
  const logisticsTotals = logisticsData?.totals || logisticsData || {};
  const customsTotals = customsData?.totals || customsData || {};
  const kentsTotals = kentsData?.totals || kentsData || {};
  const monthlyTotals = monthlyData?.totals || {};
  const monthlyOrder = monthlyData?.order || {};

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-[8px] w-full auto-rows-[160px]">
      <ReportCard
        title="Oylik"
        positive={fmt(monthlyTotals.total_sum)}
        negative={fmt(monthlyOrder.total_return)}
        variant="primary"
        navigateTo="/m-manager/reports-hub/monthly"
        isLoading={monthlyLoading}
      />
      <ReportCard
        title="Qoldiq"
        positive={inventoryData?.totalKv ? `${formatPrice(Number(inventoryData.totalKv))} m²` : "—"}
        negative={fmt(inventoryData?.totalPrice)}
        navigateTo="/m-manager/reports-hub/inventory"
        isLoading={isInventoryLoading}
      />
      <ReportCard
        title="Savdo"
        positive={fmt(monthlyOrder.total_sum)}
        negative={fmt(monthlyOrder.total_return)}
        navigateTo="/m-manager/reports-hub/sales"
        isLoading={monthlyLoading}
      />
      <ReportCard
        title="Kent"
        positive={fmt(kentsTotals.total_period_income || kentsTotals.total_given)}
        negative={fmt(kentsTotals.total_debt)}
        navigateTo="/m-manager/reports-hub/kents"
        isLoading={kentsLoading}
      />
      <ReportCard
        title="Diller"
        positive={fmt(dealerTotals.total_period_given || dealerTotals.total_given)}
        negative={fmt(dealerTotals.total_debt)}
        navigateTo="/m-manager/reports-hub/dealers"
        isLoading={dealerLoading}
      />
      <ReportCard
        title="Zavod"
        positive={fmt(factoryTotals.given || factoryTotals.total_given)}
        negative={fmt(factoryTotals.owed || factoryTotals.total_owed)}
        navigateTo="/m-manager/reports-hub/factories"
        isLoading={factoryLoading}
      />
      <ReportCard
        title="Logistika"
        positive={fmt(logisticsTotals.given || logisticsTotals.total_given)}
        negative={fmt(logisticsTotals.owed || logisticsTotals.total_owed)}
        navigateTo="/m-manager/reports-hub/logistics"
        isLoading={logisticsLoading}
      />
      <ReportCard
        title="Bojxona"
        positive={fmt(customsTotals.given || customsTotals.total_given)}
        negative={fmt(customsTotals.owed || customsTotals.total_owed)}
        navigateTo="/m-manager/reports-hub/bojxona"
        isLoading={customsLoading}
      />
      <ReportCard
        title="Qarz"
        positive={clientDebtData?.totalDebt != null ? `${formatPrice(Number(clientDebtData.totalDebt))} $` : "—"}
        negative=""
        variant="danger"
        navigateTo="/m-manager/reports-hub/client-debt"
        isLoading={clientDebtLoading}
      />
    </div>
  );
}
