import { DefinedInitialDataOptions, useQuery } from "@tanstack/react-query";

import {  getAllData, getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import {  TKassareportData, TQuery ,TDealearQuery, TKassaPayrollsData } from "./type";


interface IKassaReportData {
  options?: DefinedInitialDataOptions<TKassareportData>;
  queries?: TQuery;
  enabled?: boolean;
  id:string | undefined;
}

interface IReportDealerData {
  options?: DefinedInitialDataOptions<TKassareportData[]>;
  queries?: TDealearQuery;
  enabled?: boolean;
}

interface IPayrollsDealerData {
  options?: DefinedInitialDataOptions<TKassaPayrollsData>;
  queries?: TDealearQuery;
  enabled?: boolean;
}

interface ICashflowForMainManager {
  enabled?: boolean;
  id:string | undefined;
}


 type TReportData = {
    income: number,
    expense: number
 }
export const useReportsSingle = ({ queries,id ,enabled}: IKassaReportData) =>
  useQuery({
    queryKey: [apiRoutes.reports,id, queries],
    queryFn: ({ pageParam = 10 }) =>
      getByIdData<TKassareportData, TQuery>(apiRoutes.reports, id ||"" ,{
        ...queries,
        page: pageParam as number,
        limit: 10,
      }),
    // getNextPageParam: (lastPage) => {
    //   if (lastPage.meta?.currentPage <= lastPage.meta?.totalPages) {
    //     return lastPage?.meta?.currentPage + 1;
    //   } else {
    //     return null;
    //   }
    // },
    enabled: enabled,
    // initialPageParam: 1,
  });

  export const useReportDealer = ({ queries,enabled}: IReportDealerData) =>
    useQuery({
      queryKey: [apiRoutes.reportsDealer, queries],
      queryFn: () =>
        getAllData<TKassareportData[], TDealearQuery>(apiRoutes.reportsDealer || "" ,queries),
      enabled: enabled,
    });

    export const usePayrollsDealer = ({ queries,enabled}: IPayrollsDealerData) =>
      useQuery({
        queryKey: [apiRoutes.payrollsDealer, queries],
        queryFn: () =>
          getAllData< TKassaPayrollsData, TDealearQuery>(apiRoutes.payrollsDealer || "" ,queries),
        enabled: enabled,
      });

export const useCashflowForMainManager = ({enabled,id}: ICashflowForMainManager) =>
  useQuery({
    queryKey: [apiRoutes.cashflowForMainManager],
    queryFn: () =>
      getByIdData<TReportData, TDealearQuery>(apiRoutes.cashflowForMainManager ,id || ""),
    enabled: enabled,
  });