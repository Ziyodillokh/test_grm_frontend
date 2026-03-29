import { DataTable } from "@/components/ui/data-table";

import CardSort from "@/components/card-sort";
import { KassaColumnsLoc } from "./columns";
import {
  useCashflowForMainManager,
  // usePayrollsDealer,
  useReportDealer,
  useReportsSingle,
} from "./queries";
import { useNavigate, useParams } from "react-router-dom";
import {  TKassareportData } from "./type";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMeStore } from "@/store/me-store";
import { useMemo } from "react";
import { MonthsArray } from "@/consts";
import { useYear } from "@/store/year-store";

export default function PageFinanceSingle() {
  const { meUser } = useMeStore();
  const {year}= useYear()
  const { id } = useParams();
  const navigate = useNavigate();
  const [, setMyCashFlow] = useQueryState("myCashFlow", parseAsBoolean);
  const { data: kassaData, isLoading: KassaLoading } = useReportsSingle({
    id: id,
    enabled: Boolean(id),
    queries: {
      year,
      page: 1,
    },
  });

  const { data: CashflowForMainManager } = useCashflowForMainManager({
    id: id,
    enabled: Boolean(id),
  });


  const { data: ReportDealer } = useReportDealer({
    enabled: Boolean(kassaData),
    queries: {
      month: kassaData?.month,
      year: kassaData?.year,
    },
  });

  // const { data: PayrollsDealer } = usePayrollsDealer({
  //   enabled: Boolean(kassaData),
  //   queries: {
  //     month: kassaData?.month,
  //     year: kassaData?.year,
  //   },
  // });
  

  const myData: TKassareportData = {
    status: "my",
    totalIncome: CashflowForMainManager?.income? CashflowForMainManager?.income?.toFixed(2):0 ,
    totalExpense: CashflowForMainManager?.expense,
  } as TKassareportData;

  const DealerData = useMemo(() => {
    return {
      isDealer: true,
      dealerReportId: ReportDealer?.[0]?.id,
      totalSum: ReportDealer?.[0]?.totalIncome || 0,
      totalPlasticSum: ReportDealer?.[0]?.totalPlasticSum || 0,
      in_hand:ReportDealer?.[0]?.in_hand || 0,
      totalExpense: ReportDealer?.[0]?.totalExpense || 0,
      status:
        (ReportDealer?.[0]?.isMManagerConfirmed &&
        ReportDealer?.[0]?.isAccountantConfirmed)
          ? ReportDealer?.[0]?.status
          : ReportDealer?.[0]?.isMManagerConfirmed
            ? "m_manager_confirmed"
            : ReportDealer?.[0]?.isAccountantConfirmed
              ? "accountant_confirmed"
              : ReportDealer?.[0]?.status || "open",
      isAccountantConfirmed: ReportDealer?.[0]?.isAccountantConfirmed,
      isMManagerConfirmed: ReportDealer?.[0]?.isMManagerConfirmed,
    } as TKassareportData;
  }, [ReportDealer]);


  const ReportSingleData = useMemo(() => {
    return kassaData?.kassaReport
      ? [myData,
         DealerData, ...(kassaData?.kassaReport as TKassareportData[])]
      : [myData];
  }, [kassaData, myData, DealerData]);

  return (
    <>
      <>
      <p className="text-[#272727] text-[20px] m-4 mr-auto ">Финансовый учёт | {kassaData?.month && MonthsArray[(kassaData?.month ||1)-1].label}</p>
        <CardSort
          reportId={id}
          isUserSelectble={true}
          isAddible={true}
          isOnlyCash={Boolean(meUser?.position?.role == 9)}
          isOnlyTerminal={Boolean(meUser?.position?.role == 10)}
          KassaReport={kassaData}
        />
        <DataTable
          columns={KassaColumnsLoc || []}
          data={ReportSingleData || []}
          isLoading={KassaLoading}
          isRowClickble={true}
          className="max-h-[calc(100vh-365px)] scrollCastom"
          onRowClick={(item) => {
            if (item?.status == "my") {
              navigate(item?.status);
              setMyCashFlow(true);
            } else if (item?.isDealer) {
              navigate(
                `/m-manager/d-manager/report-monthly/${item?.dealerReportId}/info`
              );
            } else if (item?.payrollsDealerId){
              navigate(
                `/m-manager/report-finance/statement/${item?.payrollsDealerId}/info`
              );
              
            } else {
              setMyCashFlow(false);
            }
          }}
          // fetchNextPage={KassafetchNextPage}
          // hasNextPage={KassafhasNextPage ?? false}
          // isFetchingNextPage={KassaisFetchingNextPage}
        />
      </>
    </>
  );
}
