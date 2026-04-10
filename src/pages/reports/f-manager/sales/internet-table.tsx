import { DataTable } from "@/components/ui/data-table";
import { InternetColumns } from "./columns";
import SalesFilter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useSalesInternet } from "./queries";
import { useNavigate } from "react-router-dom";
import { useYear } from "@/store/year-store";

export default function InternetTable() {
  const { year } = useYear();
  const navigate = useNavigate();
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSalesInternet({
      queries: {
        year,
        month: Number(month),
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
          columns={InternetColumns}
          data={items}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          onRowClick={(item) => navigate(`internet/${item.id}`)}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
