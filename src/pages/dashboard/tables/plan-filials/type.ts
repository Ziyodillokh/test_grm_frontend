export interface TData {
  filialId: string;
  filialTitle: string;
  year: number;
  plan_price: string;
  earn: string;
}

export interface TQuery {
  limit: number;
  page: number;
  type?: string;
  debt_id?: string;
  month?: string;
  year?: number;
}

export interface ITotal {
  totals: {
    plan_price: number;
    earn: number;
    year: number;
  };
}
