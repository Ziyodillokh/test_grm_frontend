export interface SalesItem {
  id: string;
  title: string;
  count: number;
  kv: number;
  sum: number;
  profit: number;
  discount: number;
}

export interface SalesPartiyaItem {
  partiyaId: string;
  partiyaNo: string;
  country: string;
  factory: string;
  date: string;
  soldCount: number;
  soldKv: number;
  soldSum: number;
  profit: number;
  discount: number;
  comingSum: number;
  overheadSum: number;
}

export interface SalesMeta {
  totals: {
    totalCount: number;
    totalKv: number;
    totalSum: number;
    totalProfit: number;
    totalDiscount: number;
    totalComingSum: number;
    totalOverheadSum: number;
  };
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SalesResponse {
  items: SalesItem[];
  meta: SalesMeta;
}

export interface SalesPartiyaResponse {
  items: SalesPartiyaItem[];
  meta: SalesMeta;
}

export interface SalesQuery {
  year?: number;
  month?: number;
  filialId?: string;
  dealerId?: string;
  partiyaId?: string;
  groupBy?: string;
  countryId?: string;
  factoryId?: string;
  collectionId?: string;
  modelId?: string;
  search?: string;
  page?: number;
  limit?: number;
}
