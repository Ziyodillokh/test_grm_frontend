import formatPrice from "@/utils/formatPrice";
import ReportCard from "./report-card";
import {
  useDealerCardTotals,
  useFactoryCardTotals,
  useLogisticsCardTotals,
  useCustomsCardTotals,
  useKentsCardTotals,
  useClientDebtSummary,
  BossDashboardFilter,
} from "./queries";

const fmt = (v: number | undefined) => `${formatPrice(Number(v || 0))} $`;

// Qoldiq qarz: > 0 bo'lsa -{value}, aks holda 0
const fmtDebt = (v: number | undefined | null) => {
  const n = Number(v || 0);
  return n > 0 ? `-${formatPrice(n)} $` : "0 $";
};

interface Props {
  /** General filter for cards — faqat yearga ta'sir qiladi, month/filialId emas */
  filter: Pick<BossDashboardFilter, "year">;
  inventoryData?: any;
  isInventoryLoading?: boolean;
  yearlyData?: any;
}

export default function ReportCardsGrid({
  filter,
  inventoryData,
  isInventoryLoading,
  yearlyData,
}: Props) {
  // Right grid har doim umumiy ma'lumot ko'rsatadi (filialId va month yo'q, faqat year)
  const generalFilter = { year: filter.year };

  const { data: dealerData, isLoading: dealerLoading } = useDealerCardTotals(generalFilter);
  const { data: factoryData, isLoading: factoryLoading } = useFactoryCardTotals(generalFilter);
  const { data: logisticsData, isLoading: logisticsLoading } = useLogisticsCardTotals(generalFilter);
  const { data: customsData, isLoading: customsLoading } = useCustomsCardTotals(generalFilter);
  const { data: kentsData, isLoading: kentsLoading } = useKentsCardTotals(generalFilter);
  const { data: clientDebtData, isLoading: clientDebtLoading } = useClientDebtSummary(filter.year);

  const dealerTotals = dealerData?.totals || {};
  const factoryTotals = factoryData?.totals || factoryData || {};
  const logisticsTotals = logisticsData?.totals || logisticsData || {};
  const customsTotals = customsData?.totals || customsData || {};
  const kentsTotals = kentsData?.totals || kentsData || {};

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-[8px] w-full auto-rows-[160px]">
      <ReportCard
        title="Moliya"
        positive={
          yearlyData?.totalSale != null || yearlyData?.totalSum != null
            ? `${formatPrice(Number(yearlyData?.totalSale ?? yearlyData?.totalSum ?? 0))} $`
            : "—"
        }
        negative={
          yearlyData?.netProfitTotalSum != null || yearlyData?.additionalProfitTotalSum != null
            ? `${formatPrice(Number(yearlyData?.netProfitTotalSum ?? yearlyData?.additionalProfitTotalSum ?? 0))} $ foyda`
            : ""
        }
        variant="primary"
        navigateTo="/m-manager/reports-hub/monthly"
        isLoading={!yearlyData}
      />
      <ReportCard
        title="Qoldiq"
        positive={
          inventoryData?.product?.total_kv != null
            ? `${formatPrice(Number(inventoryData.product.total_kv))} kv/m`
            : "—"
        }
        negative={fmt(inventoryData?.product?.total_sum)}
        navigateTo="/m-manager/reports-hub/inventory"
        isLoading={isInventoryLoading}
      />
      <ReportCard
        title="Savdo"
        positive={
          yearlyData?.totalSize != null
            ? `${formatPrice(Number(yearlyData.totalSize))} kv/m`
            : "—"
        }
        negative={fmt(yearlyData?.totalSale)}
        navigateTo="/m-manager/reports-hub/sales"
        isLoading={!yearlyData}
      />
      <ReportCard
        title="Kent"
        positive={fmt(kentsTotals.total_given)}
        negative={fmtDebt(kentsTotals.total_debt)}
        navigateTo="/m-manager/reports-hub/kents"
        isLoading={kentsLoading}
      />
      <ReportCard
        title="Diller"
        positive={fmt(dealerTotals.total_given)}
        negative={fmtDebt(dealerTotals.total_debt)}
        navigateTo="/m-manager/reports-hub/dealers"
        isLoading={dealerLoading}
      />
      <ReportCard
        title="Zavod"
        positive={fmt(factoryTotals.total_given ?? factoryTotals.given)}
        negative={fmtDebt(factoryTotals.total_debt ?? factoryTotals.total_owed ?? factoryTotals.owed)}
        navigateTo="/m-manager/reports-hub/factories"
        isLoading={factoryLoading}
      />
      <ReportCard
        title="Logistika"
        positive={fmt(logisticsTotals.total_given ?? logisticsTotals.given)}
        negative={fmtDebt(logisticsTotals.total_debt ?? logisticsTotals.total_owed ?? logisticsTotals.owed)}
        navigateTo="/m-manager/reports-hub/logistics"
        isLoading={logisticsLoading}
      />
      <ReportCard
        title="Bojxona"
        positive={fmt(customsTotals.total_given ?? customsTotals.given)}
        negative={fmtDebt(customsTotals.total_debt ?? customsTotals.total_owed ?? customsTotals.owed)}
        navigateTo="/m-manager/reports-hub/bojxona"
        isLoading={customsLoading}
      />
      <ReportCard
        title="Qarz"
        positive={fmt(clientDebtData?.totalReturned)}
        negative={fmtDebt(clientDebtData?.totalDebt)}
        variant="danger"
        navigateTo="/m-manager/reports-hub/client-debt"
        isLoading={clientDebtLoading}
      />
    </div>
  );
}
