import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import {
  CustomsReportResponse,
  CustomsReportQuery,
  CustomsDetailResponse,
  CustomsDetailQuery,
} from "./type";

interface ICustomsReportQuery {
  queries?: CustomsReportQuery;
  enabled?: boolean;
}

export const useCustomsReport = ({
  queries,
  enabled = true,
}: ICustomsReportQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.bojxonaReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<CustomsReportResponse, CustomsReportQuery>(
        apiRoutes.bojxonaReport,
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

interface ICustomsDetailQuery {
  customsId: string;
  queries?: CustomsDetailQuery;
  enabled?: boolean;
}

export const useCustomsDetail = ({
  customsId,
  queries,
  enabled = true,
}: ICustomsDetailQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.bojxona, customsId, "report", queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<CustomsDetailResponse, CustomsDetailQuery>(
        `${apiRoutes.bojxona}/${customsId}/report`,
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
    enabled: enabled && !!customsId,
    initialPageParam: 1,
  });
