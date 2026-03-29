import { DataTable } from "@/components/ui/data-table";
import { useDataCashflow } from "./queries";
import { Columns } from "./columns";
import { useParams } from "react-router-dom";
import CardSort from "./card-sort";
import { useClientById } from "../form/actions";
import Filters from "./filter";

export default function ReportPage() {
  const { id } = useParams();


  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        limit: 10,
        page: 1,
        debt:id,
      },
      enabled: true,
    });

  
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  const { data: SortData} = useClientById({
    id: id != "new" ? id || undefined : undefined,
  });

  return (
    <>
      <div className="h-[calc(100vh-65px)] scrollCastom">
          <Filters SortData={SortData}/>
         {id && <CardSort    SortData={SortData}  />}
        <DataTable
          columns={Columns}
          data={flatData || []}
          isLoading={isLoading}
          isRowClickble={false}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
}
