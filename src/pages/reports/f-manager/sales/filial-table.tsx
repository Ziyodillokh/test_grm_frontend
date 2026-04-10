import { DataTable } from "@/components/ui/data-table";
import { FilialColumns } from "./columns";
import SalesFilter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useSalesFilial } from "./queries";
import { useNavigate } from "react-router-dom";
import { useYear } from "@/store/year-store";
import { useMeStore } from "@/store/me-store";

export default function FilialTable() {
  const { year } = useYear();
  const { meUser } = useMeStore();
  const navigate = useNavigate();
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));

  const role = meUser?.position?.role ?? 0;

  // F_MANAGER auto-scoped — skip top-level, go straight to drill-down
  const autoFilialId = role <= 7 ? meUser?.filial?.id : undefined;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSalesFilial({
      queries: {
        year,
        month: Number(month),
        filialId: autoFilialId,
        groupBy: autoFilialId ? "country" : "filial",
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
          columns={FilialColumns}
          data={items}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          onRowClick={(item) => navigate(`filial/${item.id}`)}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
