export type TData = {
  id: string;
  fullName: string;
  phone: string;
  given: number;
  owed: number;
  totalDebt: number;
  created_date: string;
  number_debt: number;
};

export type TQuery = {
  limit?: number;
  page?: number;
  search?: string;
  filial?: string;
  filialId?: string;
};
