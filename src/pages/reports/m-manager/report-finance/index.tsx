import { DataTable } from "@/components/ui/data-table";

import CardSort from "@/components/card-sort";
import { useReports, useReportsTotal } from "./queries";
import { KassaColumnsLoc } from "./columns";
import { useYear } from "@/store/year-store";
export default function PageFinance() {
  const {year}= useYear()
  const {
    data: kassaData,
    isLoading: KassaLoading,
    fetchNextPage: KassafetchNextPage,
    hasNextPage: KassafhasNextPage,
    isFetchingNextPage: KassaisFetchingNextPage,
  } = useReports({
    queries: {
      page: 1,
      year,
    },
  });
  
  const {data:ReportsTotal } = useReportsTotal({
    queries:{
      year
    }
  });

  const flatKasssaData =
    kassaData?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
       <p className="text-[#272727] text-[20px] m-4 mr-auto">Финансовый учёт</p>
        <CardSort
        isTotalPage={true}
          KassaReport={ReportsTotal}
        />
        <DataTable
          columns={KassaColumnsLoc || []}
          data={flatKasssaData}
          isLoading={KassaLoading}
          isRowClickble={true}
          className="h-[calc(100vh-300px)] scrollCastom"
          fetchNextPage={KassafetchNextPage}
          hasNextPage={KassafhasNextPage ?? false}
          isFetchingNextPage={KassaisFetchingNextPage}
        />
    </>
  );
}
