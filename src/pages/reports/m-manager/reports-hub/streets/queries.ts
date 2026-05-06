import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import {
  StreetReportResponse,
  StreetReportQuery,
  StreetDetailResponse,
  StreetDetailQuery,
} from "./type";

interface IStreetReportQuery {
  queries?: StreetReportQuery;
  enabled?: boolean;
}

export const useStreetReport = ({ queries, enabled = true }: IStreetReportQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.streetReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<StreetReportResponse, StreetReportQuery>(apiRoutes.streetReport, {
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

interface IStreetDetailQuery {
  streetId: string;
  queries?: StreetDetailQuery;
  enabled?: boolean;
}

export const useStreetDetail = ({
  streetId,
  queries,
  enabled = true,
}: IStreetDetailQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.street, streetId, "report", queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<StreetDetailResponse, StreetDetailQuery>(
        `${apiRoutes.street}/${streetId}/report`,
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
    enabled: enabled && !!streetId,
    initialPageParam: 1,
  });
