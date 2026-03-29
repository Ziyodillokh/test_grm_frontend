export interface TKassareportData {
  id: string;
  totalSellCount: number;
  additionalProfitTotalSum: number;
  netProfitTotalSum: number;
  totalSize: number;
  kassaReportStatus: number;
  isAccountantConfirmed: boolean;
  isMManagerConfirmed: boolean;
  year: number;
  managerSum: number;
  month: number;
  status: string;
  filial?: {
    id: string;
    title: string;
  };
  kassaReport?: TKassareportData[];
  reportStatus?: number;
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

export interface TChaFlowData {
  expense: number;
  income: number;
}

export interface RemainingProductData {
  remainingSize: number;
  remainingSum: number;
  count: number;
}
export interface RemainingProductColactionData {
  country: {
    id: string;
    title: string;
  };
  remainingSize: number;
  remainingSum: number;
  count: number;
}
export interface TQuery {
  search?: string | undefined;
  filialId?: string;
  kassaId?: string;
  limit?: number;
  page?: number;
  id?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  type?: string;
  year?: number;
}
