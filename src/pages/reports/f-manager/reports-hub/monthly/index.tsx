import { DataTable } from "@/components/ui/data-table";
import { useMeStore } from "@/store/me-store";
import { useYear } from "@/store/year-store";
import { useNavigate } from "react-router-dom";
import { useDataKassa } from "../../report/queries";
import { useKassaTotals } from "./queries";
import { MonthlyColumns } from "./columns";
import CardSort from "@/components/card-sort";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function MonthlyReportsPage() {
  const { meUser } = useMeStore();
  const { year } = useYear();
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);

  const filialId = meUser?.filial?.id;

  const {
    data: kassaData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDataKassa({
    queries: {
      filial: filialId || undefined,
      page: 1,
      limit: 12,
      year,
    },
    enabled: Boolean(filialId),
  });

  const flatData = kassaData?.pages?.flatMap((page) => page?.items || []) || [];

  const { data: totals } = useKassaTotals({
    queries: {
      filialId: filialId || "",
      year,
    },
    enabled: Boolean(filialId),
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Oylik Hisobotlar</h2>
      {totals && <CardSort KassaReport={totals as any} />}
      <div className="h-[calc(100vh-370px)] scrollCastom">
        <DataTable
          columns={MonthlyColumns}
          data={flatData}
          isLoading={isLoading}
          isRowClickble={true}
          onRowClick={(row: any) => {
            if (row?.id) {
              push(row?.filial?.name || "Kassa", `/f-manager/reports-hub/monthly/${row.id}`);
              navigate(`/f-manager/reports-hub/monthly/${row.id}`);
            }
          }}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
