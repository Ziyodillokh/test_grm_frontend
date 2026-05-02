export interface OrderItem {
  id: string;
  date: string;
  price: number;
  kv: number;
  x: number;
  plastic: number;
  discount: number;
  collection: string | null;
  size: string | null;
  color: string | null;
  shape: string | null;
}

export interface DayData {
  date: string;
  count: number;
  kv: number;
  earn: number;
  discount: number;
  plastic: number;
  orders: OrderItem[];
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
