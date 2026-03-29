
export interface TKassareportData {
  id: string;
  totalSellCount: number;
  additionalProfitTotalSum: number;
  netProfitTotalSum: number;
  totalSize: number;
  kassaReportStatus:number;
  year: number;
  month: number;
  status: string;
  debt_sum?:number;
  dealer_frozen_owed?:number;
  filial?: {
    id: string;
    title: string;
    owed?: number;
  };
  in_hand?:number;
  kassaReport?:TKassareportData[];
  reportStatus?:number;
  totalPlasticSum: number;
  totalInternetShopSum: number;
  totalSale: number;
  totalSaleReturn: number;
  totalCashCollection: number;
  totalDiscount: number;
  totalIncome: number;
  totalExpense: number;
  totalSum: number;
}

export interface TQuery {
  search?: string | undefined;
  filialId?: string;
  kassaId?: string;
  reportId?:string;
  limit?: number;
  page?: number;
  id?: string;
  year?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  type?:string;
}
