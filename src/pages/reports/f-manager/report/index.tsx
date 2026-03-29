
import { DataTable } from "@/components/ui/data-table";
import { useMeStore } from "@/store/me-store";

import Filter from "./filter";
import { useDataKassa, useKassaReportTotal } from "./queries";
import CardSort from "@/components/card-sort";
import { KassaColumns } from "./columns";
import { parseAsInteger, parseAsIsoDate, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import { useCashflowFilial, useKassaReportSingle } from "../../m-manager/filial-report-finance/queries";
import { TData } from "./type";
import { useYear } from "@/store/year-store";
import { useDataCashflow } from "../report-single/queries";

export default function Page() {
  const { meUser } = useMeStore();
  const { id } = useParams()
  const { year } = useYear()

  const [startDate] = useQueryState("startDate", parseAsIsoDate);
  const [endDate] = useQueryState("endDate", parseAsIsoDate);
  const [, seMyMonth] = useQueryState("myMonth", parseAsInteger);

  const { data: KassaReport } = useKassaReportTotal({
    queries: {
      filialId: meUser?.filial?.id || '',
    },
    enabled: Boolean(!id && meUser?.filial?.id),
  })

  const { data: cashflow, isLoading: cashflowLoading } = useDataCashflow({
    queries: {
      kassaReport: id || undefined,
      limit: 10,
      page: 1,
    },
    enabled: Boolean(id),
  })

  const flatCashflow = cashflow?.pages?.flatMap((page) => page?.items || []) || [];

  const { data: KassaReportSingle } = useKassaReportSingle({
    id: id || undefined,
    enabled: Boolean(id),
  });

  const { data: kassaData, isLoading: KassaLoading, fetchNextPage: KassafetchNextPage, hasNextPage: KassafhasNextPage, isFetchingNextPage: KassaisFetchingNextPage } =
    useDataKassa({
      queries: {
        filial: meUser?.filial?.id || undefined,
        page: 1,
        limit: 10,
        year,
        report: id || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      },
    });

  const flatKasssaData = kassaData?.pages?.flatMap((page) => page?.items || []) || [];

  const { data: cashflowFilial } = useCashflowFilial({
    id: id || undefined,
    enabled: Boolean(id),

  })

  return (
    <>
      <Filter status={KassaReportSingle?.status || ""} month={id ? KassaReportSingle?.month : KassaReport?.month} />
      <CardSort
        //  isAddible={Boolean(id)}
        kassaReportId={id} KassaReport={id ? KassaReportSingle : KassaReport} />
      <div className="h-[calc(100vh-370px)] scrollCastom">
        <DataTable
          columns={KassaColumns || []}
          data={(flatCashflow?.length) ? [
            {
              id: 'my',
              status: "Мои приходы и расходы",
              income: cashflowFilial?.income,
              expense: cashflowFilial?.expense,
            } as TData, ...flatKasssaData] : flatKasssaData}
          isLoading={KassaLoading || cashflowLoading}
          isRowClickble={true}
          onRowClick={() => {
            seMyMonth(id ? (KassaReportSingle?.month || 1) : (KassaReport?.month || 1))
          }}

          fetchNextPage={KassafetchNextPage}
          hasNextPage={KassafhasNextPage ?? false}
          isFetchingNextPage={KassaisFetchingNextPage}
        />

      </div>
    </>
  );
}
