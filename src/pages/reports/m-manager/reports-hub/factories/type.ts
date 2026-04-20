export interface FactoryReportItem {
  id: string;
  title: string;
  country: string;
  owed: number;
  given: number;
  totalDebt: number;
  period_owed: number;
  period_given: number;
}

export interface FactoryReportQuery {
  year?: number;
  month?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface FactoryReportTotals {
  total_owed: number;
  total_given: number;
  total_debt: number;
}

export interface FactoryReportResponse {
  items: FactoryReportItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: FactoryReportTotals;
}

export interface CollectionEntry {
  collection_title: string;
  price_per_kv: number;
  total_kv: number;
  total_cost: number;
}

export interface FactoryDetailItem {
  id: string;
  entry_type: "partiya" | "payment";
  date: string;
  partiya_name?: string;
  total_kv?: number;
  total_cost: number;
  collections?: CollectionEntry[];
  comment?: string;
  who_paid?: string;
}

export interface FactoryDetailQuery {
  year?: number;
  month?: number;
  page?: number;
  limit?: number;
}

export interface FactoryDetailTotals {
  period_owed: number;
  period_given: number;
  period_balance: number;
}

export interface FactoryDetailResponse {
  items: FactoryDetailItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: FactoryDetailTotals;
  factory: {
    id: string;
    title: string;
    country: string;
    owed: number;
    given: number;
    totalDebt: number;
  };
}

export interface FactoryEnabledItem {
  id: string;
  title: string;
  country?: { id: string; title: string };
}
