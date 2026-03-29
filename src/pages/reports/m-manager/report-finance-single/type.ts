export interface TKassareportData {
  id: string;
  payrollsDealerId?: string;
  totalSellCount: number;
  additionalProfitTotalSum: number;
  netProfitTotalSum: number;
  totalSize: number;
  kassaReportStatus: number;
  year: number;
  month: number;
  isDealer?: boolean;
  dealerReportId?: string;
  status: string;
  debt_sum?:number;
  debt_profit_sum?:number;
  debt_kv?:number;
  in_hand?:number;
  filial?: {
    id: string;
    title: string;
    owed?: number;
  };
  isMManagerConfirmed?: boolean;
  isAccountantConfirmed?: boolean;
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
  in_hand: number;
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
}
