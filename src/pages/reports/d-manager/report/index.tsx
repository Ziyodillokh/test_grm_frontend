import { DataTable } from "@/components/ui/data-table";

import {
  parseAsIsoDate,
  useQueryState,
} from "nuqs";
import { useDataCashflow } from "./queries";
import { Columns } from "./columns";
import { useParams } from "react-router-dom";
import CardSort from "./card-sort";
import { useKassaReportSingle } from "@/pages/report/table/queries";

export default function DealerReportPage() {
  const { id } = useParams();
  const [startDate] = useQueryState("startDate", parseAsIsoDate);
  const [endDate] = useQueryState("endDate", parseAsIsoDate);

  
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        limit: 10,
        page: 1,
        fromDate: startDate || undefined,
        toDate: endDate || undefined,
        kassaReport:id,
      },
      enabled: true,
    });

    const { data: KassaReportSingle } = useKassaReportSingle({
      id: id ,
      enabled: Boolean(id),
    });
  
  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <div className="h-[calc(100vh-65px)] scrollCastom">
         {id && <CardSort  kassaReportId={id} isAddable SortData={KassaReportSingle}  />}
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
