import { ICountryReportData,TQuery } from "@/pages/reports/m-manager/remaider/type";
import { getAllData } from "@/service/apiHelpers";
import { DefinedInitialDataInfiniteOptions, useInfiniteQuery } from "@tanstack/react-query";

interface IcountryReport {
    options?: DefinedInitialDataInfiniteOptions<ICountryReportData>;
    queries?: TQuery;
    enabled: boolean;
    api: string;
  }
export const useFetchData = ({
    options,
    enabled,
    queries,
    api
  }: IcountryReport) =>
    useInfiniteQuery({
      ...options,
      queryKey: [ api, queries],
      queryFn: ({ pageParam = 1 }) =>
        getAllData<ICountryReportData, TQuery>(api, {
          ...queries,
          page: pageParam as number,
          limit: queries?.limit || 10,
        }),
      getNextPageParam: (lastPage) => {
        if (
          lastPage?.meta?.pagination?.page <=
          lastPage?.meta?.pagination?.totalPages
        ) {
          return Number(lastPage?.meta?.pagination?.page) + 1;
        } else {
          return null;
        }
      },
      enabled,
      initialPageParam: 1,
    });