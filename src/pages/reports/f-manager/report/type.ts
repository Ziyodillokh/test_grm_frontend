export interface TData {
  return_sale: number;
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
  in_hand?:number;
  debt_sum?:number;
  is_online: boolean;
  price: number;
  tip: string;
  title: string;
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
  additionalProfitTotalSum: number;
  netProfitTotalSum: number;
  totalSize: number;
  discount: string;
  sale:number;
  cash_collection:number;
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
  closer?: {
    id: string;
    isActive: boolean;
    firstName: string;
    lastName: string;
    fatherName: string;
    login: string;
    hired: string;
    from: string;
    to: string;
    username: string | null;
    salary: number;
    email: string | null;
    phone: string;
    password: string;
    isUpdated: boolean;
    createdAt: string;
    avatar: {
        id: string;
        path: string;
        model: string;
        mimetype: string;
        size: number;
        name: string;
        created_at: string;
    };
},
closer_m?: {
  id: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  fatherName: string;
  login: string;
  hired: string;
  from: string;
  to: string;
  username: string | null;
  salary: number;
  email: string | null;
  phone: string;
  password: string;
  isUpdated: boolean;
  createdAt: string;
  avatar: {
      id: string;
      path: string;
      model: string;
      mimetype: string;
      size: number;
      name: string;
      created_at: string;
  };
}
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
  return_sale?: number;
  totalSaleSizeReturn?: number;
  return_size?: number;
  totalCashCollection?: number;
  cash_collection?: number;
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
  additionalProfitTotalSum?: number;
  netProfitTotalSum?: number;
  in_hand?: number;
  opening_balance?: number;
  debt_count?: number;
  debt_kv?: number;
  debt_sum?: number;
  debt_profit_sum?: number;
  status?: string;
  isAccountantConfirmed?: boolean;
  isMManagerConfirmed?: boolean;
  isManagerRejected?: boolean;
  isAccountantRejected?: boolean;
  filialType?: string;
  filial?: any;
  report?: any;
  kassaReport?: TKassareportData[];
  reportStatus?: number;
}
export interface TQuery {
  search?: string | undefined;
  filial?: string;
  limit: number;
  year?: number;
  report?: string;
  page: number;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface TKassaReportQuery {
  filialId?: string;

}
