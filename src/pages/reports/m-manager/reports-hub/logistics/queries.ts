import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import {
  LogisticsReportResponse,
  LogisticsReportQuery,
  LogisticsDetailResponse,
  LogisticsDetailQuery,
} from "./type";

interface ILogisticsReportQuery {
  queries?: LogisticsReportQuery;
  enabled?: boolean;
}

export const useLogisticsReport = ({
  queries,
  enabled = true,
}: ILogisticsReportQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.logisticsReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<LogisticsReportResponse, LogisticsReportQuery>(
        apiRoutes.logisticsReport,
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
    enabled,
    initialPageParam: 1,
  });

interface ILogisticsDetailQuery {
  logisticsId: string;
  queries?: LogisticsDetailQuery;
  enabled?: boolean;
}

export const useLogisticsDetail = ({
  logisticsId,
  queries,
  enabled = true,
}: ILogisticsDetailQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.logistics, logisticsId, "report", queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<LogisticsDetailResponse, LogisticsDetailQuery>(
        `${apiRoutes.logistics}/${logisticsId}/report`,
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
    enabled: enabled && !!logisticsId,
    initialPageParam: 1,
  });
