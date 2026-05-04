import { DataTable } from "@/components/ui/data-table";
import { KassaColumnsLoc } from "./columns";
import { useKassaReports } from "./queries";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useReportsSingle } from "../report-finance-single/queries";
import CardSort from "../../d-manager/report/card-sort";
import { useYear } from "@/store/year-store";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function PageDealerKassaReport() {
  const {id}  =useParams()
  const location = useLocation();
  const push = useBreadcrumbStore((s) => s.push);
  const [seleted, setSeleted] = useState<string[]>([]);
  const {year} = useYear()

  useEffect(() => {
    push("Diller", location.pathname);
  }, [location.pathname]);
  const {
    data: ReportsSingle,
    // isLoading: ReportsSingleLoading,
  
  } = useReportsSingle({
    id: id,
    enabled: Boolean(id&& id != "undefined"),
  queries:{}
  });
  
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useKassaReports({
      queries: {
        reportId:id ,
        year
      },
      enabled: Boolean(id  && id != "undefined"),
    });


  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <div className="h-[calc(100vh-70px)] scrollCastom">
          <CardSort  SortData={ReportsSingle}  />
          <DataTable
            columns={KassaColumnsLoc}
            data={
              flatData.length
                ? flatData
                : []
            }
            isLoading={isLoading}
            isRowClickble={true}
            onSelectionChange={(e) => {
              const newIds = e.map((item) => item.id).filter((id): id is string => !!id);
                if (JSON.stringify(seleted) != JSON.stringify(newIds)) {
                  setSeleted(newIds);
                }
            }}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
          />
      </div>
    </>
  );
}
