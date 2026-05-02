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
  kassaReportStatus?: number;
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
  filialType?: string;
  filial?: any;
  report?: any;
  managerSum?: number;
  manegerSum?: number;
  accountantSum?: number;
  managerSaldo?: number;
  accountantSaldo?: number;
  isManagerRejected?: boolean;
  isAccountantRejected?: boolean;
  // Extra fields specific to this file
  payrollsDealerId?: string;
  isDealer?: boolean;
  dealerReportId?: string;
  kassaReport?: TKassareportData[];
  kassas?: TKassareportData[];
  reportStatus?: number;
}

export interface TKassaPayrollsData {
  data: TKassaPayrollsDataItem;
}

export interface TKassaPayrollsDataItem {
  dateOne: Date;
  dateTwo: Date;
  deletedDate: null;
  id: string;
  title: string;
  createdAt: Date;
  award: number;
  bonus: number;
  total: number;
  plastic: number;
  inHand: number;
  prepayment: number;
  status: string;
  month: number;
  isAccountantConfirmed: boolean;
  isMManagerConfirmed: boolean;
  year: number;
  number_payroll: number;
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
  year?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  type?: string;
}
export interface TDealearQuery {
  month?: number;
  year?: number;
  userId?: string;
}
