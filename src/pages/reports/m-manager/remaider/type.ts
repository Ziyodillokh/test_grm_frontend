// ── Filial snapshot (new inventory-report API) ──

export interface InventoryItem {
  id: string;
  title: string;
  count: number;
  kv: number;
  sum: number;
  profit: number;
}

export interface InventoryMeta {
  totals: {
    totalCount: number;
    totalKv: number;
    totalSum: number;
    totalProfit: number;
  };
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InventoryResponse {
  items: InventoryItem[];
  meta: InventoryMeta;
}

// ── Partiya snapshot ──

export interface PartiyaItem {
  partiyaId: string;
  partiyaNo: string;
  country: string;
  factory: string;
  date: string;
  initialCount: number;
  initialKv: number;
  soldCount: number;
  soldKv: number;
  soldSum: number;
  remainingCount: number;
  remainingKv: number;
  remainingSum: number;
  profit: number;
}

export interface PartiyaResponse {
  items: PartiyaItem[];
  meta: {
    totals: {
      totalRemainingCount: number;
      totalRemainingKv: number;
      totalRemainingSum: number;
      totalProfit: number;
    };
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

// ── Query params ──

export interface TQuery {
  search?: string;
  filialId?: string;
  date?: string;
  groupBy?: string;
  countryId?: string;
  factoryId?: string;
  collectionId?: string;
  modelId?: string;
  limit?: number;
  page?: number;
  year?: number;
  // Legacy fields used by dashboard
  month?: string;
  typeOther?: string;
  country?: string;
  factory?: string;
  kassaId?: string;
  model?: string;
  id?: string;
}

// ── Legacy types (used by dashboard) ──

export interface SalesData {
  collection: { id: string; title: string };
  country: { id: string; title: string };
  factory: { id: string; title: string };
  id?: string;
  title?: string;
  totalCount: number;
  totalKv: number;
  totalPrice: number;
  totalKvPrice?: number;
  totalSellCount: number;
  totalSellKv: number;
  totalSellPrice: number;
  totalNetProfitPrice?: number;
}

type LegacyMeta = {
  pagination: {
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
  totals: {
    totalCount: number;
    totalKv: number;
    totalPrice: number;
    totalSellCount: number;
    totalSellKv: number;
    totalSellPrice: number;
    totalNetProfitPrice?: number;
  };
};

export interface ICountryReportData {
  items: SalesData[];
  data: SalesData[];
  meta: LegacyMeta;
}

export interface IModelData {
  items: SalesData[];
  meta: LegacyMeta;
}
