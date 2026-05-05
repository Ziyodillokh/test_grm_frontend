export interface KentReportItem {
  id: string;
  fullName: string;
  phone: string;
  given: number;
  owed: number;
  totalDebt: number;
  number_debt: number;
  period_income: number;
  period_expense: number;
}

export interface KentReportQuery {
  year?: number;
  month?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface KentReportTotals {
  total_given: number;
  total_owed: number;
  total_debt: number;
  total_period_income: number;
  total_period_expense: number;
}

export interface KentReportResponse {
  items: KentReportItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: KentReportTotals;
}

export interface KentDetailItem {
  id: string;
  price: number;
  type: string;
  tip: string;
  comment: string;
  title: string;
  date: string;
  is_online: boolean;
  cashflow_type: {
    id: string;
    title: string;
    slug: string;
  };
  debt: {
    id: string;
    fullName: string;
  };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: {
      id: string;
      path: string;
      mimetype: string;
      name: string;
    };
  };
}

export interface KentDetailQuery {
  year?: number;
  month?: number;
  fromDate?: string;
  toDate?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface KentDetailTotals {
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface KentDetailResponse {
  items: KentDetailItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: KentDetailTotals;
  debt: {
    id: string;
    fullName: string;
    phone: string;
    given: number;
    owed: number;
    totalDebt: number;
  };
}
