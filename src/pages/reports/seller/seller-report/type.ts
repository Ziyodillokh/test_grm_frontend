export interface TData {
  id: string;
  firstName: string;
  lastName: string;
  plan_price: string;
  earn: string;
  avatar?: {
    path: string;
  };
  count: number;
  discount: number;
  kv: number;
}

export interface TQuery {
  search?: string | undefined;
  filial?: string;
  filialId?: string;
  limit: number;
  page: number;
  month?: string;
  year?: number;
}

export interface User {
  id: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  fatherName: string;
  login: string;
  hired: string;
  from: string;
  to: string;
  avatar: {
    id: string;
    path: string
    model: string;
    mimetype: string;
    size: number;
    name: string;
    created_at: string;
  };
  username: string | null;
  salary: number;
  email: string | null;
  phone: string;
  password: string;
  isUpdated: boolean;
  createdAt: string;
}
