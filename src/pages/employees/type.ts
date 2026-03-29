export type TData = {
  id: string;
  isActive: boolean;
  avatar: {
    id: string;
    path: string;
    model: string;
    mimetype: string;
    size: number;
    name: string;
    created_at: string;
  };
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
  position: {
    id: string;
    title: string;
    is_active: boolean;
    role: number;
  };
  filial: {
    id: string;
    title: string;
    name: string;
    telegram: string;
    address: string;
    startWorkTime: string;
    endWorkTime: string;
    addressLink: string;
    landmark: string;
    phone1: string;
    phone2: string | null;
    isActive: boolean;
    hickCompleted: boolean;
    need_get_report: boolean;
    type: string;
  };
};

export type TQuery = {
  title?: string;
  search?:string;
  report?:string;
  limit?: number;
  page?: number;
  status?:string;
  type?: string;
  filial?: string;
  filialId?: string;
  kassaId?: string;
  casherId?:string;
  kassaReport?:string;
  tip?:string;
  cashflowSlug?:string;
  fromDate?:string,
  toDate?:string
};
