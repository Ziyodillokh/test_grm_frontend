import { DataTable } from "@/components/ui/data-table";
import { CountryColumns, CollectionColumns } from "./columns";
import SalesFilter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useSalesFilial, useSalesDealer, useSalesInternet, useSalesPartiya } from "./queries";
import { useNavigate, useParams } from "react-router-dom";
import { useYear } from "@/store/year-store";

/**
 * Level 1 drill-down.
 * filial/dealer/internet → groupBy=country
 * partiya → groupBy=collection (partiya skips country/factory)
 */
export default function CountryTable() {
  const { year } = useYear();
  const navigate = useNavigate();
  const { tabType, entityId } = useParams();
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));

  const isPartiya = tabType === "partiya";
  const queryMap = { filial: useSalesFilial, dealer: useSalesDealer, internet: useSalesInternet, partiya: useSalesPartiya };
  const useHook = queryMap[tabType as keyof typeof queryMap] || useSalesFilial;
  const idKey = isPartiya ? "partiyaId" : tabType === "dealer" ? "dealerId" : "filialId";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useHook({
      queries: {
        year,
        month: Number(month),
        [idKey]: entityId,
        groupBy: isPartiya ? "collection" : "country",
      },
    });

  const items = data?.pages?.flatMap((page) => page?.items || []) as any[] || [];
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
          columns={isPartiya ? CollectionColumns : CountryColumns}
          data={items}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          onRowClick={(item: any) => navigate(`${item.id}`)}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
