export interface StreetReportItem {
  id: string;
  fullName: string;
  phone: string;
  given: number;
  owed: number;
  percent: number;
  totalDebt: number;
  number_debt: number;
  period_income: number;
  period_expense: number;
}

export interface StreetReportQuery {
  year?: number;
  month?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface StreetReportTotals {
  total_given: number;
  total_owed: number;
  total_percent: number;
  total_debt: number;
  total_period_income: number;
  total_period_expense: number;
}

export interface StreetReportResponse {
  items: StreetReportItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: StreetReportTotals;
}

export interface StreetDetailItem {
  id: string;
  price: number;
  streetPercent: number;
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
  street: {
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

export interface StreetDetailQuery {
  year?: number;
  month?: number;
  fromDate?: string;
  toDate?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface StreetDetailTotals {
  total_income: number;
  total_percent: number;
  total_expense: number;
  balance: number;
}

export interface StreetDetailResponse {
  items: StreetDetailItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: StreetDetailTotals;
  street: {
    id: string;
    fullName: string;
    phone: string;
    given: number;
    owed: number;
    percent: number;
    totalDebt: number;
  };
}
