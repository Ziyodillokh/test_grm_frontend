import { DefinedInitialDataOptions, useQuery } from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { ReportsHomePageCurrentMonthQuery, ReportsHomePageCurrentMonthData, ReportsHomePageCurrentLeftData, } from "./types";

interface IReportsHomePageCurrentMonth {
  options?: DefinedInitialDataOptions<ReportsHomePageCurrentMonthData>;
  queries?: ReportsHomePageCurrentMonthQuery;
  enabled?: boolean
}
export const useReportsHomePageCurrentMonth = ({ options, enabled, queries }: IReportsHomePageCurrentMonth) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.reportsHomePageCurrentMonth, queries],
    enabled,
    queryFn: () =>
      getAllData<ReportsHomePageCurrentMonthData, ReportsHomePageCurrentMonthQuery>(apiRoutes.reportsHomePageCurrentMonth, queries),
  });


interface IReportsHomePageCurrentLeft {
  options?: DefinedInitialDataOptions<ReportsHomePageCurrentLeftData>;
  queries?: ReportsHomePageCurrentMonthQuery;
  enabled?: boolean
}
export const useReportsHomePageCurrentLeft = ({ options, enabled, queries }: IReportsHomePageCurrentLeft) =>
  useQuery({
    ...options,
    enabled,
    queryKey: [apiRoutes.reportsHomePageCurrentLeft, queries],
    queryFn: () =>
      getAllData<ReportsHomePageCurrentLeftData, ReportsHomePageCurrentMonthQuery>(apiRoutes.reportsHomePageCurrentLeft, queries),
  });


