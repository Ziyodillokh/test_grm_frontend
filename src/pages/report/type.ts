export interface TData {
  saleReturn: number;
  isMetric?: boolean;
  id: string;
  is_visible: boolean;
  cashflow_type: { title: string };
  code: string;
  comment: string;
  imgUrl: string | null;
  otherImgs: string[] | null;
  internetInfo: string | null;
  is_active: boolean;
  date: string;
  is_online: boolean;
  price: number;
  slug: string;
  tip: string;
  title: string;
  inHand:number;
  openingBalance?:number;
  debtSum:number;
  kassaReport?:{
    openingBalance?:number
    filialType?:string;
  }
  icon: {
    id: string;
    path: string;
    model: string;
    mimetype: string;
    size: number;
    name: string;
    created_at: string;
}
  type: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  totalSum: number;
  additionalProfitSum: number;
  netProfitSum: number;
  totalSize: number;
  discount: string;
  sale:number;
  cashCollection:number;
  plasticSum: number;
  income: number;
  cashFlowSumBoss: number;
  expense: number;
  cashFlowSumShop: number;
  expenditureBoss: number;
  expenditureShop: number;
  internetShopSum: number;
  status: string;
  model: {
    id: string;
    title: string;
  };
  color: {
    id: string;
    title: string;
    code: string;
  };
  collection: {
    id: string;
    title: string;
  };
  size: {
    id: string;
    title: string;
    x: number | null;
    y: number | null;
    kv: number | null;
  };
  shape: {
    id: string;
    title: string;
    meter: boolean;
  };
  style: {
    id: string;
    title: string;
  };
  country: {
    id: string;
    title: string;
  };
}

export interface TActionData {
  title: string;
  id: string;
  collection: {
    id: string;
    title: string;
  };
  code: string;
}
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
  // Extra fields specific to this file
  frozenOwed?: number;
  owed?: number;
  manegerSum?: number;
  managerSum?: number;
  accountantSum?: number;
  kassaReport?: TKassareportData[];
  reportStatus?: number;
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
  report?:string;
  limit?: number;
  page?: number;
  id?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  type?:string;
};