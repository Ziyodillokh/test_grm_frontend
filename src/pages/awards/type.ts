export type TData = {
  
  id: string;
  title: string;
  sum: number;
  createdAt:Date;
};

export type TQuery = {
  limit?: number;
  page?: number;
  search?: string;
  filial?: string;
  filialId?: string;
};
