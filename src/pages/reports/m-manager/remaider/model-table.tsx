import { DataTable } from "@/components/ui/data-table";
import { ModelColumns } from "./columns";
import Filter from "./filter";
import { parseAsString, useQueryState } from "nuqs";
import { useFilialSnapshot } from "./queries";
import { useNavigate, useParams } from "react-router-dom";
import { useMeStore } from "@/store/me-store";

export default function ModelTable() {
  const { meUser } = useMeStore();
  const navigate = useNavigate();
  const { countryId, factoryId, collectionId } = useParams();
  const [date] = useQueryState("date", parseAsString.withDefault(""));
  const [filialId] = useQueryState("filialId", parseAsString.withDefault(""));

  const role = meUser?.position?.role ?? 0;
  const resolvedFilialId = role >= 9 ? (filialId || undefined) : meUser?.filial?.id;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFilialSnapshot({
      queries: {
        filialId: resolvedFilialId,
        date: date || undefined,
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
      <Filter
        totalCount={totals?.totalCount || 0}
        totalKv={totals?.totalKv || 0}
        totalSum={totals?.totalSum || 0}
        totalProfit={totals?.totalProfit || 0}
      />
      <div className="h-[calc(100vh-140px)] scrollCastom">
        <DataTable
          columns={ModelColumns}
          data={items}
          isLoading={isLoading}
          isRowClickble={false}
          isNumberble
          onRowClick={(item) => navigate(`${item.id}`)}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
