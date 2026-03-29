export interface TData {
  id: string;
  price: number;
  type: string;
  tip: string;
  comment: string;
  title: string;
  date: string;
  is_online: boolean;
  cashflow_type: {
    id: string;
    title: string;
    slug: string;
  };
  debt: {
    id: string;
    fullName: string;
  };
  casher: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: {
      id: string;
      path: string;
      mimetype: string;
      name: string;
    };
  };
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
    total_income: number;
    total_expense: number;
    kents_balance: number;
  };
}
