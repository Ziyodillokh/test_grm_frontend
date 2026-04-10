import { DataTable } from "@/components/ui/data-table";
import { FactoryColumns, ModelColumns } from "./columns";
import SalesFilter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useSalesFilial, useSalesDealer, useSalesInternet, useSalesPartiya } from "./queries";
import { useNavigate, useParams } from "react-router-dom";
import { useYear } from "@/store/year-store";

/**
 * Level 2 drill-down.
 * filial/dealer/internet → groupBy=factory, countryId from URL
 * partiya → groupBy=model, collectionId from URL (seg1 = countryId param)
 */
export default function FactoryTable() {
  const { year } = useYear();
  const navigate = useNavigate();
  const { tabType, entityId, countryId } = useParams();
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));

  const isPartiya = tabType === "partiya";
  const queryMap = { filial: useSalesFilial, dealer: useSalesDealer, internet: useSalesInternet, partiya: useSalesPartiya };
  const useHook = queryMap[tabType as keyof typeof queryMap] || useSalesFilial;
  const idKey = isPartiya ? "partiyaId" : tabType === "dealer" ? "dealerId" : "filialId";

  const queries = isPartiya
    ? { [idKey]: entityId, groupBy: "model" as const, collectionId: countryId }
    : { [idKey]: entityId, groupBy: "factory" as const, countryId };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useHook({
      queries: {
        year,
        month: Number(month),
        ...queries,
      },
    });

  const items = data?.pages?.flatMap((page: any) => page?.items || []) || [];
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
          columns={isPartiya ? ModelColumns : FactoryColumns}
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
