
import { DataTable } from "@/components/ui/data-table";
import { useMeStore } from "@/store/me-store";

import Filter from "./filter";
import  { useKassaReportSingle, useKassaReportTotal } from "./queries";
import CardSort from "@/components/card-sort";
import { useDataCashflow, useDataKassa } from "@/pages/cashier/report/queries";
import {  ReportColumns } from "@/pages/cashier/report/page/columns";
import { parseAsString, useQueryState } from "nuqs";
import { KassaColumns } from "./columns";

export default function Page() {
  const { meUser } = useMeStore();

  const tipFilter = {
    income:"cashflow",
    expense:"cashflow",
    sale:"order",
    return:"order",
  }

  const typeFilter = {
    income:"Приход",
    expense:"Расход",
    sale:"Приход",
    return:"Расход",
  }

  const [id] = useQueryState(
    "id"
  );

  const [filial] = useQueryState(
    "filial"
  );

  const [tip] = useQueryState(
    "tip",parseAsString
  );
  const [Myid] = useQueryState(
    "Myid"
  );

  const [startDate] = useQueryState("startDate");
  const [endDate] = useQueryState("endDate");
  const [kassaReports] = useQueryState("kassaReports");
  
  const {data:KassaReport} = useKassaReportTotal({
    queries:{
      filialId:meUser?.position?.role == 10 || meUser?.position?.role == 9  ? filial || undefined :  meUser?.filial?.id || undefined,
    },
    enabled: !id,
})

  const { data:kassaData, isLoading:KassaLoading, fetchNextPage:KassafetchNextPage, hasNextPage:KassafhasNextPage, isFetchingNextPage:KassaisFetchingNextPage } =
    useDataKassa({
    queries: {
      filial: meUser?.position?.role == 10 || meUser?.position?.role == 9 ? filial || undefined :  meUser?.filial?.id || undefined,
      page: 1,
    },
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useDataCashflow({
    queries: {
      kassaId:  Myid == "myReport" ? undefined:  id || undefined,
      limit: 10,
      page: 1,
      filialId:  Myid == "myReport" ? undefined: meUser?.position?.role == 10||meUser?.position?.role ===  9   ? filial || undefined :  meUser?.filial?.id || undefined,
      casherId: Myid =="myReport" ? meUser?.id || undefined : undefined,
      kassaReport:kassaReports||undefined,
      // @ts-ignore
      type: typeFilter[tip as string],
      // @ts-ignore
      tip: tipFilter[tip],
      fromDate: startDate || undefined,
      toDate: endDate || undefined,
      cashflowSlug:tip =="collection" ? "Инкассация":undefined

    },
    enabled: Boolean(id || meUser?.position?.role ===  10 ||meUser?.position?.role ===  9  || Myid),
  });

  const { data: KassaReportSingle } = useKassaReportSingle({
    id:kassaReports || undefined,
    enabled: Boolean(kassaReports) ,
  });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];
  const flatKasssaData = kassaData?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <Filter />
      <div className="h-[calc(100vh-140px)] scrollCastom">
      {
       <CardSort  KassaReport={ Myid == "myReport" ? KassaReportSingle : id || kassaReports ? undefined : KassaReport }  KassaId={id||  undefined }/>
      }
        { Boolean(id) || meUser?.position?.role ===  10 || meUser?.position?.role ===  9 || Myid == "myReport"   ?  <DataTable
              columns={ReportColumns}
              data={flatData || []}
              isLoading={isLoading}
              isRowClickble={false}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage ?? false}
              isFetchingNextPage={isFetchingNextPage}
            /> :
            <DataTable 
            columns={KassaColumns || []}
            data={flatKasssaData || []}
            isLoading={KassaLoading}
            fetchNextPage={KassafetchNextPage}
            hasNextPage={KassafhasNextPage ?? false}
            isFetchingNextPage={KassaisFetchingNextPage}
            />
          }
      </div>
    </>
  );
}
