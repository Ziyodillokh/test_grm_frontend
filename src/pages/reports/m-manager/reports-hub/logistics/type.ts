export interface LogisticsReportItem {
  id: string;
  title: string;
  given: number;
  owed: number;
  totalDebt: number;
  period_income: number;
  period_expense: number;
}

export interface LogisticsReportQuery {
  year?: number;
  month?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface LogisticsReportTotals {
  total_given: number;
  total_owed: number;
  total_debt: number;
  total_period_income: number;
  total_period_expense: number;
}

export interface LogisticsReportResponse {
  items: LogisticsReportItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: LogisticsReportTotals;
}

export interface LogisticsDetailItem {
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
  logistics: {
    id: string;
    title: string;
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

export interface LogisticsDetailQuery {
  year?: number;
  month?: number;
  type?: string;
  page?: number;
  limit?: number;
}

export interface LogisticsDetailTotals {
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface LogisticsDetailResponse {
  items: LogisticsDetailItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: LogisticsDetailTotals;
  logistics: {
    id: string;
    title: string;
    given: number;
    owed: number;
    totalDebt: number;
  };
}
