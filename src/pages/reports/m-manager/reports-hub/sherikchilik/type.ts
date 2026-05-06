export interface ShareReportItem {
  id: string;
  fullName: string;
  phone: string;
  capital: number;
  profit: number;
  given_capital: number;
  given_profit: number;
  totalDebt: number;
  period_capital: number;
  period_given_capital: number;
  period_given_profit: number;
}

export interface ShareReportQuery {
  year?: number;
  month?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ShareReportTotals {
  total_capital: number;
  total_given_capital: number;
  total_given_profit: number;
  total_debt: number;
}

export interface ShareReportResponse {
  items: ShareReportItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: ShareReportTotals;
}

export interface ShareDetailItem {
  id: string;
  price: number;
  type: string;
  tip: string;
  comment: string;
  title: string;
  date: string;
  is_online: boolean;
  shareKind: 'capital' | 'profit' | null;
  cashflow_type: { id: string; title: string; slug: string };
  share: { id: string; fullName: string };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: { id: string; path: string; mimetype: string; name: string };
  };
}

export interface ShareDetailQuery {
  year?: number;
  month?: number;
  fromDate?: string;
  toDate?: string;
  type?: string;
  kind?: string;
  page?: number;
  limit?: number;
}

export interface ShareDetailTotals {
  total_capital: number;
  total_given_capital: number;
  total_given_profit: number;
}

export interface ShareDetailResponse {
  items: ShareDetailItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: ShareDetailTotals;
  share: {
    id: string;
    fullName: string;
    phone: string;
    capital: number;
    profit: number;
    given_capital: number;
    given_profit: number;
    totalDebt: number;
  };
}

export interface ShareItem {
  id: string;
  fullName: string;
  phone: string;
}
