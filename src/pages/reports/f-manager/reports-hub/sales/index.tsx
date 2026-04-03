import { DataTable } from "@/components/ui/data-table";
import { useMeStore } from "@/store/me-store";
import { useYear } from "@/store/year-store";
import { useDataKassa } from "../../report/queries";
import { useKassaTotals } from "../monthly/queries";
import { SalesColumns } from "./columns";
import CardSort from "@/components/card-sort";

export default function SalesReportPage() {
  const { meUser } = useMeStore();
  const { year } = useYear();

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
      <h2 className="text-xl font-semibold mb-4">Sotuv Hisoboti</h2>
      {totals && <CardSort KassaReport={totals as any} />}
      <div className="h-[calc(100vh-370px)] scrollCastom">
        <DataTable
          columns={SalesColumns}
          data={flatData}
          isLoading={isLoading}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
