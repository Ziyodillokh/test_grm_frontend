export interface DayData {
  date: string;
  count: number;
  kv: number;
  earn: number;
  discount: number;
  plastic: number;
}

export interface SellerDailyReport {
  days: DayData[];
  totals: {
    count: number;
    kv: number;
    earn: number;
    discount: number;
    plastic: number;
  };
  plan: {
    planPrice: number;
    progress: number;
  };
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: { id: string; path: string } | null;
  } | null;
}
