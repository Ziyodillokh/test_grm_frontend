import { DataTable } from "@/components/ui/data-table";
import { SizeColumns } from "./columns";
import SalesFilter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useSalesFilial, useSalesDealer, useSalesInternet } from "./queries";
import { useParams } from "react-router-dom";
import { useYear } from "@/store/year-store";

/**
 * Level 5 drill-down (filial/dealer/internet only — partiya ends at level 3).
 */
export default function SizeTable() {
  const { year } = useYear();
  const { tabType, entityId, countryId, factoryId, collectionId, modelId } = useParams();
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));

  const queryMap = { filial: useSalesFilial, dealer: useSalesDealer, internet: useSalesInternet };
  const useHook = queryMap[tabType as keyof typeof queryMap] || useSalesFilial;
  const idKey = tabType === "dealer" ? "dealerId" : "filialId";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useHook({
      queries: {
        year,
        month: Number(month),
        [idKey]: entityId,
        groupBy: "size",
        countryId,
        factoryId,
        collectionId,
        modelId,
      },
    });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.meta?.totals;

  return (
    <>
      <SalesFilter
        totalCount={totals?.totalCount || 0}
        totalKv={totals?.totalKv || 0}
        totalSum={totals?.totalSum || 0}
        totalProfit={totals?.totalProfit || 0}
        totalDiscount={totals?.totalDiscount || 0}
      />
      <div className="h-[calc(100vh-140px)] scrollCastom">
        <DataTable
          columns={SizeColumns}
          data={items}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
