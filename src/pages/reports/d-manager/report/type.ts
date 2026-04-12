export interface CollectionEntry {
  collection_title: string;
  price_per_kv: number;
  total_kv: number;
  total_cost: number;
}

export interface DealerDetailItem {
  id: string;
  entry_type: "package" | "payment";
  date: string;
  title?: string;
  total_kv?: number;
  total_cost: number;
  total_count?: number;
  collections?: CollectionEntry[];
  comment?: string;
  who_paid?: string;
  is_online?: boolean;
}

export interface DealerDetailQuery {
  year?: number;
  month?: number;
  page?: number;
  limit?: number;
}

export interface DealerDetailTotals {
  period_owed: number;
  period_given: number;
  period_balance: number;
}

export interface DealerDetailDealer {
  id: string;
  title: string;
  owed: number;
  given: number;
  balance: number;
}

export interface DealerDetailResponse {
  items: DealerDetailItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
  totals: DealerDetailTotals;
  dealer: DealerDetailDealer;
}
