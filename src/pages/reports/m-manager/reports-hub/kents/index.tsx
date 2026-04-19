import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/ui/data-table";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { useYear } from "@/store/year-store";
import { useKentReport } from "./queries";
import { KentColumns } from "./columns";
import KentFilter from "./filter";

export default function KentReportPage() {
  const navigate = useNavigate();
  const push = useBreadcrumbStore((s) => s.push);
  const { year } = useYear();
  const [month] = useQueryState(
    "month",
    parseAsString.withDefault(String(new Date().getMonth() + 1))
  );
  const [search] = useQueryState("search");
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(20));

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useKentReport({
      queries: {
        year,
        month: Number(month),
        search: search || undefined,
        limit,
      },
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.totals;

  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    window.open(
      `${baseUrl}/debt/report/excel?year=${year}&month=${month}`,
      "_blank"
    );
  };

  return (
    <div>
      <KentFilter
        totals={totals}
        showExport={true}
        onExport={handleExport}
      />
      <DataTable
        columns={KentColumns}
        data={flatData}
        isLoading={isLoading}
        isRowClickble={true}
        onRowClick={(row) => {
          const path = `/m-manager/reports-hub/clients/${row.id}`;
          push(row.fullName || "Detail", path);
          navigate(path);
        }}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
