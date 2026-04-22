export interface FilialWithReport {
  id: string;
  title: string;
  type: "filial" | "warehouse";
  lastReportId?: string;
  lastReportDate?: string;
  lastReportStatus?: string;
  lastReportCount?: number;
  lastReportVolume?: number;
  lastReportCost?: number;
  lastReportCreatedAt?: string;
}

export interface FilialReportItem {
  id: string;
  date: string;
  volume: number;
  count: number;
  cost: number;
  status: string;
  excel?: string;
  createdAt: string;
  filial?: {
    id: string;
    title: string;
    type: string;
  };
}

export interface ReInventoryItem {
  id: string;
  count: number;
  y: number;
  check_count: number;
  comingPrice: number;
  bar_code?: {
    id: string;
    code: string;
    isMetric: boolean;
    collection?: { id: string; title: string };
    model?: { id: string; title: string };
    size?: { id: string; title: string; x: number; y: number };
    country?: { id: string; title: string };
    shape?: { id: string; title: string };
    style?: { id: string; title: string };
    color?: { id: string; title: string };
  };
  product?: {
    id: string;
    partiya?: { id: string; title: string };
  };
}

export interface ReInventoryTotals {
  total: number;
  volume: number;
  count: number;
}
