import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

// 1) Filiallar + oxirgi pereuchot holati
export const useFilialReportFilials = ({
  queries,
  enabled = true,
}: {
  queries?: { search?: string; limit?: number };
  enabled?: boolean;
}) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.filialReportAllFilials, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<any, any>(apiRoutes.filialReportAllFilials, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 100,
      }),
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.meta?.page < Math.ceil(lastPage?.meta?.total / lastPage?.meta?.limit)) {
        return lastPage.meta.page + 1;
      }
      return null;
    },
    enabled,
    initialPageParam: 1,
  });

// 2) Bitta filialning pereuchotlar ro'yxati
export const useFilialReports = ({
  filialId,
  queries,
  enabled = true,
}: {
  filialId: string;
  queries?: { limit?: number };
  enabled?: boolean;
}) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.filialReport, filialId, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<any, any>(apiRoutes.filialReport, {
        filialId,
        page: pageParam as number,
        limit: queries?.limit || 50,
      }),
    getNextPageParam: (lastPage: any) => {
      const meta = lastPage?.meta;
      if (meta && meta.page < Math.ceil(meta.total / meta.limit)) {
        return meta.page + 1;
      }
      return null;
    },
    enabled: enabled && !!filialId,
    initialPageParam: 1,
  });

// 3) Bitta pereuchotning re_inventory itemlari
export const useReInventoryItems = ({
  reportId,
  queries,
  enabled = true,
}: {
  reportId: string;
  queries?: { page?: number; limit?: number; type?: string; search?: string };
  enabled?: boolean;
}) =>
  useInfiniteQuery({
    queryKey: [apiRoutes.reInventoryGetByFilialReport, reportId, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<any, any>(apiRoutes.reInventoryGetByFilialReport + "/" + reportId, {
        ...queries,
        page: pageParam as number,
        limit: queries?.limit || 50,
      }),
    getNextPageParam: (lastPage: any) => {
      const meta = lastPage?.meta;
      if (meta && meta.currentPage < meta.totalPages) {
        return meta.currentPage + 1;
      }
      return null;
    },
    enabled: enabled && !!reportId,
    initialPageParam: 1,
  });

// 4) Bitta pereuchotning totals
export const useReInventoryTotals = ({
  reportId,
  type,
  enabled = true,
}: {
  reportId: string;
  type?: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [apiRoutes.reInventoryGetByFilialReportTotals, reportId, type],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.reInventoryGetByFilialReportTotals + "/" + reportId, {
        ...(type ? { type } : {}),
      }),
    enabled: enabled && !!reportId,
  });
