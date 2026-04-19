import { DataTable } from "@/components/ui/data-table";
import { ModelColumns } from "./columns";
import SalesFilter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useSalesFilial, useSalesDealer, useSalesInternet } from "./queries";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useYear } from "@/store/year-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

/**
 * Level 4 drill-down (filial/dealer/internet only — partiya ends at level 3).
 */
export default function ModelTable() {
  const { year } = useYear();
  const navigate = useNavigate();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const { tabType, entityId, countryId, factoryId, collectionId } = useParams();
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
        groupBy: "model",
        countryId,
        factoryId,
        collectionId,
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
          columns={ModelColumns}
          data={items}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          onRowClick={(item: any) => {
            const path = `${location.pathname}/${item.id}`;
            push(item.name || item.title || "Detail", path);
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
