import { DefinedInitialDataOptions, useQuery } from "@tanstack/react-query";

import { ProductsChecksQuery } from "@/pages/products-check/type";
import { getAllData, getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { TChaFlowData, TData, TKassareportData, TQuery } from "../type";

interface IData {
  options?: DefinedInitialDataOptions<TResponse<TData>>;
  queries?: TQuery;
}
interface IData1 {
  options?: DefinedInitialDataOptions<TData[]>;
  queries?: TQuery;
  enabled?: boolean;
}
interface IProductsChecks {
  options?: DefinedInitialDataOptions<TData>;
  id: string | undefined;
  queries?: ProductsChecksQuery;
}
interface IKassareport {
  options?: DefinedInitialDataOptions<TKassareportData>;
  queries?: TQuery;
  enabled?: boolean;
}
interface IKassareportId {
  options?: DefinedInitialDataOptions<TKassareportData>;
  queries?: TQuery;
  id?:string
  enabled: boolean;
}

interface ICashflowFilial{
  enabled: boolean;
  id:string | undefined
}
export const useKassa= ({ options, queries }: IData) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.kassa, queries],
    queryFn: () =>
      getAllData<TResponse<TData>, TQuery>(apiRoutes.kassa, queries),
  });

export const useDataCashflowTypes = ({ options, queries,enabled }: IData1) =>
  useQuery({
    ...options,
    enabled,
    queryKey: [apiRoutes.cashflowTypes, queries],
    queryFn: () =>
      getAllData<TData[], TQuery>(apiRoutes.cashflowTypes, queries),
  });

export const useOpenKassa = ({ options, id, queries }: IProductsChecks) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.openKassa, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TData, ProductsChecksQuery>(
        apiRoutes.openKassa,
        id || "",
        queries
      ),
  });

  export const useKassaById = ({ options, id, queries }: IProductsChecks) =>
    useQuery({
      ...options,
      queryKey: [apiRoutes.kassa, id],
      enabled: Boolean(id),
      queryFn: () =>
        getByIdData<TData, ProductsChecksQuery>(
          apiRoutes.kassa,
          id || "",
          queries
        ),
    });

    export const useKassaReportTotal= ({ options, queries,enabled }: IKassareport) =>
      useQuery({
        ...options,
        queryKey: [apiRoutes.kassaReportTotal,queries],
        enabled,
        queryFn: () =>
          getAllData<TKassareportData, TQuery>(
            apiRoutes.kassaReportTotal,
            queries
          ),
      });
  
      export const useKassaReportSingle= ({ options,id, queries,enabled }: IKassareportId) =>
        useQuery({
          ...options,
          queryKey: [apiRoutes.kassaReports,queries],
          enabled,
          queryFn: () =>
            getByIdData<TKassareportData, TQuery>(
              apiRoutes.kassaReports,
              id || "",
              queries
            ),
        });
    

        export const useCashflowFilial= ({ enabled,id }: ICashflowFilial) =>
          useQuery({
            queryKey: [apiRoutes.cashflowFilial],
            enabled,
            queryFn: () =>
              getByIdData<TChaFlowData, TQuery>(
                apiRoutes.cashflowFilial,
                id || "",
              ),
          });
      