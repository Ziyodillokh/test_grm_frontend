export interface TData{
  id?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  totalSellCount?: number;
  totalSum?: number;
  additionalProfitTotalSum?: number;
  netProfitTotalSum?: number;
  totalSize?: number;
  plasticSum?: number;
  internetShopSum?: number;
  sale?: number;
  cash_collection?: number;
  discount?: number;
  income?: number;
  expense?: number;
  in_hand?: number;
  debt_sum?:number;
  status?: string;
closer?: {
    id: string;
    isActive: boolean;
    firstName: string;
    lastName: string;
    fatherName: string;
    login: string;
    hired: string;
    from: string;
    to: string;
    username: string | null;
    salary: number;
    email: string | null;
    phone: string;
    password: string;
    isUpdated: boolean;
    createdAt: string;
    avatar: {
        id: string;
        path: string;
        model: string;
        mimetype: string;
        size: number;
        name: string;
        created_at: string;
    };
},
closer_m?: {
  id: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  fatherName: string;
  login: string;
  hired: string;
  from: string;
  to: string;
  username: string | null;
  salary: number;
  email: string | null;
  phone: string;
  password: string;
  isUpdated: boolean;
  createdAt: string;
  avatar: {
      id: string;
      path: string;
      model: string;
      mimetype: string;
      size: number;
      name: string;
      created_at: string;
  };
}
}


export interface TChaFlowData{
  expense: number,
  income: number
}

export interface TQuery {
  search?: string | undefined;
  filialId?: string;
  kassaId?: string;
  limit?: number;
  page?: number;
  report?:string
  id?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  type?:string;
}
