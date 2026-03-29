import { useMeStore } from "@/store/me-store";
import { useDataDebt } from "./queries";
import { DebtClientolumns } from "./columns";
import Filters from "./filter";
import { DataTable } from "@/components/ui/data-table";

export default function PageCleintDebt() {
  const { meUser } = useMeStore();

  const { data:kassaData, isLoading:KassaLoading, fetchNextPage:KassafetchNextPage, hasNextPage:KassafhasNextPage, isFetchingNextPage:KassaisFetchingNextPage } =
  useDataDebt({
    queries: {
      filialId: meUser?.filial?.id || undefined,
      page: 1,
      limit:10,
    },
  });

  const flatKasssaData = kassaData?.pages?.flatMap((page) => page?.items || []) || [];


  
  return (
    <>
      <Filters/>
      <div className="h-[calc(100vh-140px)] scrollCastom">
      <DataTable
        columns={DebtClientolumns || []}
        data={flatKasssaData}
        isLoading={KassaLoading}
        isRowClickble={true}
        fetchNextPage={KassafetchNextPage}
        hasNextPage={KassafhasNextPage ?? false}
        isFetchingNextPage={KassaisFetchingNextPage}
      />
      </div>
    </>
  );
}
