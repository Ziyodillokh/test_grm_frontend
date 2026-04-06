import { DataTable } from "@/components/ui/data-table";

import Filter from "./filter";
import CardSort from "@/components/card-sort";
import {
  parseAsBoolean,
  parseAsIsoDate,
  parseAsString,
  useQueryState,
} from "nuqs";
import { useKassaReportTotal } from "../../f-manager/report/queries";
import { useDataCashflow } from "./queries";
import { Columns } from "./columns";
import { useParams } from "react-router-dom";
import { useMeStore } from "@/store/me-store";
import { useKassaReportSingle } from "../filial-report-finance/queries";
import { useReportsSingle } from "../report-finance-single/queries";
import { useYear } from "@/store/year-store";

export default function ReportPage() {
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

  const { id, kassaReportId } = useParams();

  const [myCashFlow] = useQueryState(
    "myCashFlow",
    parseAsBoolean.withDefault(false)
  );

  const [FManagerCashFlow] = useQueryState(
    "FManagerCashFlow",
    parseAsBoolean.withDefault(false)
  );

  const { meUser } = useMeStore();
  const {year} = useYear()
  const [filial] = useQueryState("filial");

  const [tip] = useQueryState("tip", parseAsString);
  const [cashflowSlug] = useQueryState("cashflowSlug", parseAsString);

  const [startDate] = useQueryState("startDate", parseAsIsoDate);
  const [endDate] = useQueryState("endDate", parseAsIsoDate);
  const [search] = useQueryState("search", parseAsString);
  const [typesManage] = useQueryState("typesManage", parseAsString);

  const { data: KassaReport } = useKassaReportTotal({
    queries: {
      filialId: filial || undefined,
    },
    enabled: !id && !FManagerCashFlow && !myCashFlow ,
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        limit: 10,
        page: 1,
        year,
        filialId: filial || undefined,
        kassaId:
          id === "undefined" || !id || myCashFlow || FManagerCashFlow
            ? undefined
            : id,
        createdById:myCashFlow?  typesManage || undefined:  id === "undefined" ? meUser?.id : undefined,
        // @ts-ignore
        type: typeFilter[tip as string],
        // @ts-ignore
        tip: tipFilter[tip],
        search: search || undefined,
        cashflowSlug: tip == "collection" ? "Инкассация" : cashflowSlug|| undefined,
        fromDate: startDate || undefined,
        toDate: endDate || undefined,
        report: myCashFlow && !FManagerCashFlow ? id : undefined,
        kassa: FManagerCashFlow ? kassaReportId || undefined : undefined,
      },
      enabled: true,
    });

  const { data: KassaReportSingle } = useKassaReportSingle({
    id: kassaReportId || undefined,
    enabled: Boolean(kassaReportId),
  });

  const { data: myCashFlowReports } = useReportsSingle({
    id: id || undefined,
    enabled: Boolean(myCashFlow && id),
  });


  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  // Biznes umumiy totallar (filtrlarga qarab o'zgaradi)
  const businessTotals = data?.pages?.[0]?.totals;
  const businessIncome = (businessTotals?.totalSum || 0) - (businessTotals?.totalExpense || 0);
  const businessExpense = businessTotals?.totalExpense || 0;

  return (
    <>
      <Filter month={myCashFlow?myCashFlowReports?.month: KassaReportSingle?.month} filial={KassaReportSingle?.filial?.title} />
      < >
        {myCashFlow && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {/* Oq card — o'zimga tegishli */}
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-muted-foreground mb-1">Mening balansim</p>
              <p className="text-2xl font-bold">
                {(meUser?.position?.role == 9
                  ? myCashFlowReports?.managerSum || 0
                  : myCashFlowReports?.accountantSum || myCashFlowReports?.accauntantSum || 0
                ).toFixed(2)}$
              </p>
              <p className="text-xs text-muted-foreground mt-3 mb-1">Saldo balans</p>
              <p className="text-sm font-semibold text-[#89A143]">
                {(meUser?.position?.role == 9
                  ? myCashFlowReports?.managerSaldo || 0
                  : myCashFlowReports?.accountantSaldo || 0
                ).toFixed(2)}$
              </p>
            </div>
            {/* Yashil card — biznes umumiy kirim */}
            <div className="bg-[#89A143] rounded-xl p-5 text-white">
              <p className="text-xs opacity-80 mb-1">Biznes kirim</p>
              <p className="text-2xl font-bold">
                +{businessIncome.toFixed(2)}$
              </p>
            </div>
            {/* Qizil card — biznes umumiy chiqim */}
            <div className="bg-[#E38157] rounded-xl p-5 text-white">
              <p className="text-xs opacity-80 mb-1">Biznes chiqim</p>
              <p className="text-2xl font-bold">
                -{businessExpense.toFixed(2)}$
              </p>
            </div>
          </div>
        )}
        {
          <CardSort
          isUserSelectble
            isOnlineCashFlow={meUser?.position.role == 10}
            isOnlyCash={myCashFlow && Boolean(meUser?.position?.role == 9)}
            isOnlyTerminal={myCashFlow && Boolean(meUser?.position?.role == 10)}
            isAddible={myCashFlow}
            kassaReportId={FManagerCashFlow ? kassaReportId : undefined}
            reportId={myCashFlow && !FManagerCashFlow ? id : undefined}
            KassaReport={
             ( id === "undefined" || FManagerCashFlow)
                ? KassaReportSingle
                : myCashFlow
                  ? myCashFlowReports
                  :  !id ?  KassaReport : undefined
            }
            KassaId={(id === "undefined" || !id) ? undefined : id}
          />
        }
        <DataTable
          columns={Columns}
          data={flatData || []}
          isLoading={isLoading}
          className={`${myCashFlow ? "h-[calc(100vh-470px)]" : "h-[calc(100vh-310px)]"} scrollCastom`}
          isRowClickble={false}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </>
    </>
  );
}
