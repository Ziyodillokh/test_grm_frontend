import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { AddData, DeleteData, getAllData, getByIdData, UpdatePatchData } from "@/service/apiHelpers";
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

// 3b) Bitta filial_report o'zini olish (status uchun)
export const useFilialReportOne = ({
  reportId,
  enabled = true,
}: {
  reportId: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [apiRoutes.filialReport, reportId],
    queryFn: () =>
      getByIdData<any, undefined>(apiRoutes.filialReport, reportId),
    enabled: enabled && !!reportId,
  });

// 3c) QR code (barcode) bo'yicha qrBase ma'lumotlari
export const useQrBaseByCode = ({
  code,
  enabled = true,
}: {
  code: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [apiRoutes.qrBase + "/find-by", code],
    queryFn: () => getByIdData<any, undefined>(apiRoutes.qrBase + "/find-by", code),
    enabled: enabled && !!code,
  });

// 3d) re-inventory process (add)
export const useProcessInventory = () =>
  useMutation({
    mutationFn: async (data: any) => AddData(apiRoutes.reInventoryProcess, data),
  });

// 3e) Product check_count update (LEGACY — kept for backward compat)
export const useUpdateProductCheckCount = () =>
  useMutation({
    mutationFn: async ({ id, check_count }: { id: string; check_count: number }) =>
      UpdatePatchData(apiRoutes.products, id, { check_count }),
  });

// 3f) Re-inventory row check_count update (M-manager edit)
export const useUpdateReInventoryCheckCount = () =>
  useMutation({
    mutationFn: async ({ id, check_count }: { id: string; check_count: number }) =>
      UpdatePatchData(apiRoutes.reInventory, id, { check_count }),
  });

// 3g) Re-inventory row delete / reset (M-manager)
export const useDeleteReInventory = () =>
  useMutation({
    mutationFn: async (id: string) =>
      DeleteData(apiRoutes.reInventory, id),
  });

// 3h) Filial-report status transitions
export const useCloseFilialReport = () =>
  useMutation({
    mutationFn: async (reportId: string) =>
      AddData(`${apiRoutes.filialReport}/${reportId}/close`, {}),
  });

export const useAcceptFilialReport = () =>
  useMutation({
    mutationFn: async (reportId: string) =>
      AddData(`${apiRoutes.filialReport}/${reportId}/accept`, {}),
  });

export const useRejectFilialReport = () =>
  useMutation({
    mutationFn: async (reportId: string) =>
      AddData(`${apiRoutes.filialReport}/${reportId}/reject`, {}),
  });

// 3i) Pereuchot ochish
export const useOpenFilialReport = () =>
  useMutation({
    mutationFn: async (filialId: string) =>
      AddData(apiRoutes.filialReport, { filial: filialId }),
  });

// 4) Bitta pereuchotning totals (tab + search bo'yicha)
export const useReInventoryTotals = ({
  reportId,
  type,
  search,
  enabled = true,
}: {
  reportId: string;
  type?: string;
  search?: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [apiRoutes.reInventoryGetByFilialReportTotals, reportId, type, search],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.reInventoryGetByFilialReportTotals + "/" + reportId, {
        page: 1,
        limit: 1,
        ...(type ? { type } : {}),
        ...(search ? { search } : {}),
      }),
    enabled: enabled && !!reportId,
  });
