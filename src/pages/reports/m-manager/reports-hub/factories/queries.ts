import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import {
  FactoryReportResponse,
  FactoryReportQuery,
  FactoryDetailResponse,
  FactoryDetailQuery,
  FactoryEnabledItem,
} from "./type";

interface IFactoryReportQuery {
  queries?: FactoryReportQuery;
  enabled?: boolean;
}

export const useFactoryReport = ({
  queries,
  enabled = true,
}: IFactoryReportQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.factoryDebtReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<FactoryReportResponse, FactoryReportQuery>(
        apiRoutes.factoryDebtReport,
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

interface IFactoryDetailQuery {
  factoryId: string;
  queries?: FactoryDetailQuery;
  enabled?: boolean;
}

export const useFactoryDetail = ({
  factoryId,
  queries,
  enabled = true,
}: IFactoryDetailQuery) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.factoryDebtReport, factoryId, "detail", queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<FactoryDetailResponse, FactoryDetailQuery>(
        `/factory/${factoryId}/report`,
        {
          ...queries,
          page: pageParam as number,
          limit: queries?.limit || 50,
        }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.currentPage < lastPage?.meta?.totalPages) {
        return lastPage.meta.currentPage + 1;
      }
      return null;
    },
    enabled: enabled && !!factoryId,
    initialPageParam: 1,
  });

export const useFactoryNotReportEnabled = (enabled = true) =>
  useQuery({
    queryKey: [apiRoutes.factoryNotReportEnabled],
    queryFn: () =>
      getAllData<FactoryEnabledItem[], undefined>(
        apiRoutes.factoryNotReportEnabled
      ),
    enabled,
  });
