import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import {
  ShareReportResponse,
  ShareReportQuery,
  ShareDetailResponse,
  ShareDetailQuery,
  ShareItem,
} from "./type";

interface IShareReportQuery {
  queries?: ShareReportQuery;
  enabled?: boolean;
}

export const useShareReport = ({ queries, enabled = true }: IShareReportQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.shareReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<ShareReportResponse, ShareReportQuery>(apiRoutes.shareReport, {
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

interface IShareDetailQuery {
  shareId: string;
  queries?: ShareDetailQuery;
  enabled?: boolean;
}

export const useShareDetail = ({ shareId, queries, enabled = true }: IShareDetailQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.share, shareId, "report", queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<ShareDetailResponse, ShareDetailQuery>(
        `${apiRoutes.share}/${shareId}/report`,
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
    enabled: enabled && !!shareId,
    initialPageParam: 1,
  });

export const useSharesList = (enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.share, "list"],
    queryFn: () =>
      getAllData<{ items: ShareItem[] }, { limit: number }>(apiRoutes.share, { limit: 200 }),
    enabled,
  });
