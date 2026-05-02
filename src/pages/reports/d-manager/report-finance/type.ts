export interface TKassareportData {
  id?: string;
  year?: number;
  month?: number;
  // Both old and new field names for backward compatibility
  totalPlasticSum?: number;
  plasticSum?: number;
  totalInternetShopSum?: number;
  internetShopSum?: number;
  totalSale?: number;
  sale?: number;
  totalSaleReturn?: number;
  saleReturn?: number;
  totalSaleSizeReturn?: number;
  sizeReturn?: number;
  totalCashCollection?: number;
  cashCollection?: number;
  totalDiscount?: number;
  discount?: number;
  totalIncome?: number;
  income?: number;
  totalExpense?: number;
  expense?: number;
  kassaStatus?: number;
  // Common fields (same name in both old and new)
  totalSum?: number;
  totalSellCount?: number;
  totalSize?: number;
  additionalProfitSum?: number;
  netProfitSum?: number;
  inHand?: number;
  openingBalance?: number;
  debtCount?: number;
  debtSize?: number;
  debtSum?: number;
  debtProfitSum?: number;
  status?: string;
  confirmationStatus?: string;
  isAccountantConfirmed?: boolean;
  isMManagerConfirmed?: boolean;
  isManagerRejected?: boolean;
  isAccountantRejected?: boolean;
  filialType?: string;
  filial?: any;
  report?: any;
  // Extra fields specific to this file
  owed?: number;
  frozenOwed?: number;
  kassaReport?: TKassareportData[];
}

export interface TChaFlowData{
  expense: number,
  income: number
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
  type?:string;
  year?:number;
  filialType?:string;
}
