import { DataTable } from "@/components/ui/data-table";
import { PartiyaColumns } from "./columns";
import { parseAsString, useQueryState } from "nuqs";
import { usePartiyaSnapshot } from "./queries";
import { useYear } from "@/store/year-store";

export default function PartiyaTable() {
  const { year } = useYear();
  const [date] = useQueryState("date", parseAsString.withDefault(""));
  const [filialId] = useQueryState("filialId", parseAsString.withDefault(""));

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePartiyaSnapshot({
      queries: {
        year,
        date: date || undefined,
        filialId: filialId || undefined,
      },
    });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.meta?.totals;

  return (
    <>
      <div className="h-[64px] items-center flex gap-2 mb-2">
        <div className="text-nowrap p-5 flex gap-4 items-center h-full mr-auto bg-card rounded-xl">
          <p className="text-[14px] text-foreground">
            {totals?.totalRemainingCount || 0} шт
          </p>
          <p className="text-[14px] text-foreground">
            {(totals?.totalRemainingKv || 0).toFixed(2)} м²
          </p>
          <p className="text-[14px] text-foreground">
            {(totals?.totalRemainingSum || 0).toFixed(2)} $
          </p>
          <p className="text-[14px] text-foreground font-semibold">
            {(totals?.totalProfit || 0).toFixed(2)} $ foyda
          </p>
        </div>
      </div>
      <div className="h-[calc(100vh-140px)] scrollCastom">
        <DataTable
          columns={PartiyaColumns}
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
