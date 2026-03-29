import { DataTable } from "@/components/ui/data-table";
import { useMeStore } from "@/store/me-store";

import Filter from "./filter";
import CardSort from "@/components/card-sort";
import {  parseAsIsoDate, parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { Columns } from "./columns";
import { useDataCashflow } from "./queries";

const tipFilter = {
  income: "cashflow",
  expense: "cashflow",
  sale: "order",
  return: "order",
  terminal:"Терминал",
  discount:"Скидка",
  navar:"Навар",
};

const typeFilter = {
  income: "Приход",
  expense: "Расход",
  sale: "Приход",
  return: "Расход",
};
export default function SinglePage() {
  const { meUser } = useMeStore();

  const { id,report } = useParams();
  const [cashflowSlug] = useQueryState("cashflowSlug", parseAsString);
  const [startDate] = useQueryState("startDate",parseAsIsoDate);
  const [endDate] = useQueryState("endDate",parseAsIsoDate);
  const [tip] = useQueryState("tip", parseAsString);
  const [search] = useQueryState("search", parseAsString);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        kassaId: id != "my" ?id :undefined,
        limit: 10,
        page: 1,
        filialId: report ? undefined: meUser?.filial?.id || undefined,
        fromDate: startDate || undefined,
        toDate: endDate || undefined,
        kassaReport: id=="my" ?report ||undefined: undefined,
           // @ts-ignore
       type: typeFilter[tip as string],
       // @ts-ignore
       tip: tipFilter[tip],
       search: search || undefined,
       cashflowSlug: tip == "collection" ? "Инкассация" :cashflowSlug|| undefined,
      },
      enabled: Boolean(id),
    });
    // const { data: KassaReportSingle } = useKassaReportSingle({
    //   id:report || undefined,
    //   enabled: Boolean(report),
    // });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <>
      <Filter />
      <div className="h-[calc(100vh-140px)] scrollCastom">
        <CardSort
        //  isAddible={Boolean(report && id == 'my')} 
         KassaId={id != 'my'? id : undefined} kassaReportId={report}
          // KassaReport={KassaReportSingle}
          />
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
