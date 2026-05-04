import { DataTable } from "@/components/ui/data-table";

import {
  parseAsIsoDate,
  useQueryState,
} from "nuqs";
import { useEffect } from "react";
import { useDataCashflow } from "./queries";
import { Columns } from "./columns";
import { useParams, useLocation } from "react-router-dom";
import CardSort from "./card-sort";
import { useKassaReportSingle } from "@/pages/report/table/queries";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function DealerReportPage() {
  const { id } = useParams();
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const [startDate] = useQueryState("startDate", parseAsIsoDate);
  const [endDate] = useQueryState("endDate", parseAsIsoDate);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        limit: 10,
        page: 1,
        fromDate: startDate || undefined,
        toDate: endDate || undefined,
        kassa:id,
      },
      enabled: true,
    });

    const { data: KassaReportSingle } = useKassaReportSingle({
      id: id ,
      enabled: Boolean(id),
    });

  useEffect(() => {
    const title = (KassaReportSingle as any)?.filial?.title || (KassaReportSingle as any)?.filial?.name || "Kassa";
    if (title) push(title, location.pathname);
  }, [KassaReportSingle, location.pathname]);

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <div className="h-[calc(100vh-65px)] scrollCastom">
         {id && <CardSort  kassaId={id} SortData={KassaReportSingle}  />}
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
