import { DataTable } from "@/components/ui/data-table";

import { useReports } from "./queries";
import { KassaColumnsLoc } from "./columns";
import CardSort from "../report/card-sort";
import { useYear } from "@/store/year-store";


export default function PageFinance() {
  const{ year} = useYear()
  const {
    data: kassaData,
    isLoading: KassaLoading,
    fetchNextPage: KassafetchNextPage,
    hasNextPage: KassafhasNextPage,
    isFetchingNextPage: KassaisFetchingNextPage,
  } = useReports({
    queries: {
      page: 1,
      filialType:"dealer",
      year,
    },
  })

  const flatKasssaData =
    kassaData?.pages?.flatMap((page) => page?.items || []) || []

  return (
    <>
      <div className="h-[calc(100vh-65x)] scrollCastom">
      {/* @ts-ignore */}
      <CardSort  SortData={{}}  />
          <DataTable
            columns={KassaColumnsLoc || []}
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
