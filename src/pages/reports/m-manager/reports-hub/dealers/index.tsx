import { parseAsInteger, useQueryState } from "nuqs";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import ActionPageDealer from "@/pages/filial/formDealer";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { useDealerReport } from "./queries";
import { DealerColumns } from "./columns";
import DealerFilter from "./filter";
import { DealerReportItem } from "./type";

export default function DealerReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const [search] = useQueryState("search");
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(50));
  const [, setId] = useQueryState("id");

  const basePath = location.pathname.includes("/d-manager/")
    ? "/d-manager/reports-hub/dealers"
    : "/m-manager/reports-hub/dealers";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDealerReport({
      queries: {
        search: search || undefined,
        limit,
      },
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-sidebar border-border border-b h-[64px] flex items-center px-4 gap-3">
        <p className="text-[16px] font-medium mr-auto">Dillerlar Hisoboti</p>
        <Button
          onClick={() => setId("new")}
          variant="secondary"
          className="h-[44px]"
        >
          <Plus size={18} className="mr-1" />
          Diller qo'shish
        </Button>
      </div>

      <DealerFilter />

      <DataTable
        columns={DealerColumns}
        data={flatData}
        isLoading={isLoading}
        isRowClickble={false}
        onRowClick={(row: DealerReportItem) => {
          const path = `${basePath}/${row.id}`;
          push(row.title || "Detail", path);
          navigate(path);
        }}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />

      <ActionPageDealer />
    </div>
  );
}
