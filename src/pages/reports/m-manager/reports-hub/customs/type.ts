export interface CustomsReportItem {
  id: string;
  title: string;
  given: number;
  owed: number;
  totalDebt: number;
  period_income: number;
  period_expense: number;
}

export interface CustomsReportQuery {
  year?: number;
  month?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CustomsReportTotals {
  total_given: number;
  total_owed: number;
  total_debt: number;
  total_period_income: number;
  total_period_expense: number;
}

export interface CustomsReportResponse {
  items: CustomsReportItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: CustomsReportTotals;
}

export interface CustomsDetailItem {
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
  customs: {
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

export interface CustomsDetailQuery {
  year?: number;
  month?: number;
  type?: string;
  page?: number;
  limit?: number;
}

export interface CustomsDetailTotals {
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface CustomsDetailResponse {
  items: CustomsDetailItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: CustomsDetailTotals;
  customs: {
    id: string;
    title: string;
    given: number;
    owed: number;
    totalDebt: number;
  };
}
