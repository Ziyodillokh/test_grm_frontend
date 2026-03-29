export interface TData {
  id: string;
  price: 28981;
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
    type: string;
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
  user_id?: string;
  filial_id?: string;
  month?: string;
  year?:number;
  cashflow_type?: string;
}

export interface ITotal {
  totals: {
    boss: number;
    kassa: number;
    business: number;
  };
}
