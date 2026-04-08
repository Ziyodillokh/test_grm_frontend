import { useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import type { SellerDailyReport } from "./type";

export const useSellerDailyReport = (
  sellerId: string | undefined,
  year: number,
  month: number
) =>
  useQuery({
    queryKey: ["/filial-plan/seller-daily", sellerId, year, month],
    queryFn: () =>
      getAllData<SellerDailyReport, { year: number; month: number }>(
        `/filial-plan/seller-daily/${sellerId}`,
        { year, month }
      ),
    enabled: !!sellerId,
  });
