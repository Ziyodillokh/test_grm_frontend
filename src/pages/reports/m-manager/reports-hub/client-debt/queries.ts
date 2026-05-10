import { useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

export const useDebtFilials = () =>
  useQuery({
    queryKey: [apiRoutes.clientDebtReportFilials],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.clientDebtReportFilials, {}),
  });

export const useDebtClients = (
  filialId?: string,
  type?: "mijoz" | "qarzdor" | "oddiy_qarzdor" | "savdo_qarzdor",
  page = 1,
  limit = 50,
  search?: string,
) =>
  useQuery({
    queryKey: [apiRoutes.clientDebtReportClients, filialId, type, page, limit, search],
    queryFn: () =>
      getAllData<any, any>(
        `${apiRoutes.clientDebtReportClients}/${filialId}/clients`,
        { page, limit, ...(type ? { type } : {}), ...(search ? { search } : {}) }
      ),
    enabled: !!filialId,
  });

export const useDebtOrders = (
  clientId?: string,
  query?: { year?: number; month?: number; page?: number; limit?: number }
) =>
  useQuery({
    queryKey: [apiRoutes.clientDebtReportOrders, clientId, query],
    queryFn: () =>
      getAllData<any, any>(
        `${apiRoutes.clientDebtReportOrders}/${clientId}/orders`,
        query || {}
      ),
    enabled: !!clientId,
  });
