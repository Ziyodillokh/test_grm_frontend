export type TData = {
  dateOne: Date;
  dateTwo: Date;
  deletedDate: Date;
  id: string;
  title: string;
  condition: number;
  conditionUnit:string;
  operator:string;
  bonusAmount: number;
  bonusUnit:string;
  endDate: Date;
  createdAt: Date;
  payroll_items: [];
};

export type TQuery = {
  limit?: number;
  page?: number;
  search?: string;
  filial?: string;
  filialId?: string;
};
