import { DataTable } from "@/components/ui/data-table";
import { CollectionColumns, SizeColumns } from "./columns";
import SalesFilter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useSalesFilial, useSalesDealer, useSalesInternet, useSalesPartiya } from "./queries";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useYear } from "@/store/year-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

/**
 * Level 3 drill-down.
 * filial/dealer/internet → groupBy=collection, countryId+factoryId from URL
 * partiya → groupBy=size, collectionId+modelId from URL (terminal level for partiya)
 */
export default function CollectionTable() {
  const { year } = useYear();
  const navigate = useNavigate();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const { tabType, entityId, countryId, factoryId } = useParams();
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));

  const isPartiya = tabType === "partiya";
  const queryMap = { filial: useSalesFilial, dealer: useSalesDealer, internet: useSalesInternet, partiya: useSalesPartiya };
  const useHook = queryMap[tabType as keyof typeof queryMap] || useSalesFilial;
  const idKey = isPartiya ? "partiyaId" : tabType === "dealer" ? "dealerId" : "filialId";

  const queries = isPartiya
    ? { [idKey]: entityId, groupBy: "size" as const, collectionId: countryId, modelId: factoryId }
    : { [idKey]: entityId, groupBy: "collection" as const, countryId, factoryId };

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
          columns={isPartiya ? SizeColumns : CollectionColumns}
          data={items}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          onRowClick={isPartiya ? undefined : (item: any) => {
            const path = `${location.pathname}/${item.id}`;
            push(item.name || item.title || "Model", path);
            navigate(`${item.id}`);
          }}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
