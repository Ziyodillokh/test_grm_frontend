import { DataTable } from "@/components/ui/data-table";
import { FactoryColumns } from "./columns";
import Filter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useFilialSnapshot } from "./queries";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMeStore } from "@/store/me-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function FoctoryTable() {
  const { meUser } = useMeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const { countryId } = useParams();
  const [date] = useQueryState("date", parseAsString.withDefault(""));
  const [filialId] = useQueryState("filialId", parseAsString.withDefault(""));

  const role = meUser?.position?.role ?? 0;
  const resolvedFilialId = role >= 9 ? (filialId || undefined) : meUser?.filial?.id;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFilialSnapshot({
      queries: {
        filialId: resolvedFilialId,
        date: date || undefined,
        groupBy: "factory",
        countryId,
      },
    });

  const items = data?.pages?.flatMap((page) => page?.items || []) || [];
  const totals = data?.pages?.[0]?.meta?.totals;

  return (
    <>
      <Filter
        totalCount={totals?.totalCount || 0}
        totalKv={totals?.totalKv || 0}
        totalSum={totals?.totalSum || 0}
        totalProfit={totals?.totalProfit || 0}
      />
      <div className="h-[calc(100vh-140px)] scrollCastom">
        <DataTable
          columns={FactoryColumns}
          data={items}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          onRowClick={(item: any) => {
            const path = `${location.pathname}/${item.id}`;
            push(item.name || item.title || "Kolleksiya", path);
            navigate(path);
          }}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
