import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import {
  KentReportResponse,
  KentReportQuery,
  KentDetailResponse,
  KentDetailQuery,
} from "./type";

interface IKentReportQuery {
  queries?: KentReportQuery;
  enabled?: boolean;
}

export const useKentReport = ({ queries, enabled = true }: IKentReportQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.debtReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<KentReportResponse, KentReportQuery>(apiRoutes.debtReport, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 20,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage < lastPage?.meta?.totalPages) {
        return lastPage.meta.currentPage + 1;
      }
      return null;
    },
    enabled,
    initialPageParam: 1,
  });

interface IKentDetailQuery {
  debtId: string;
  queries?: KentDetailQuery;
  enabled?: boolean;
}

export const useKentDetail = ({
  debtId,
  queries,
  enabled = true,
}: IKentDetailQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.debt, debtId, "report", queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<KentDetailResponse, KentDetailQuery>(
        `${apiRoutes.debt}/${debtId}/report`,
        {
          ...queries,
          page: pageParam as number,
          limit: queries?.limit || 20,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage < lastPage?.meta?.totalPages) {
        return lastPage.meta.currentPage + 1;
      }
      return null;
    },
    enabled: enabled && !!debtId,
    initialPageParam: 1,
  });
