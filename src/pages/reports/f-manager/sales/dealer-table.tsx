import { DataTable } from "@/components/ui/data-table";
import { DealerColumns } from "./columns";
import SalesFilter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useSalesDealer } from "./queries";
import { useNavigate, useLocation } from "react-router-dom";
import { useYear } from "@/store/year-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function DealerTable() {
  const { year } = useYear();
  const navigate = useNavigate();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const [month] = useQueryState("month", parseAsString.withDefault(String(new Date().getMonth() + 1)));

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSalesDealer({
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
          columns={DealerColumns}
          data={items}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          onRowClick={(item: any) => {
            const path = `${location.pathname}/dealer/${item.id}`;
            push(item.name || item.title || "Detail", path);
            navigate(`dealer/${item.id}`);
          }}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
