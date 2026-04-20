export interface DealerReportItem {
  id: string;
  title: string;
  owed: number;
  given: number;
  totalDebt: number;
  period_owed: number;
  period_given: number;
}

export interface DealerReportQuery {
  year?: number;
  month?: number;
  search?: string;
  page?: number;
  limit?: number;
  type?: string;
}

export interface DealerReportTotals {
  total_owed: number;
  total_given: number;
  total_debt: number;
  total_period_owed: number;
  total_period_given: number;
}

export interface DealerReportResponse {
  items: DealerReportItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: DealerReportTotals;
}
