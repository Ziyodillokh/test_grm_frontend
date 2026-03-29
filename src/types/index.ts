export type TResponse<T> = {
  items: T[];
  meta: {
    page: number;
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    total: number;
  };
};
export type TResponseUserLog<T> = T[];

export type IUserData = {
  id: string;
  isActive: boolean;
  avatar: any;
  firstName: string;
  lastName: string;
  fatherName: string;
  login: string;
  hired: string;
  from: string;
  to: string;
  username: string | null;
  salary: number | null;
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
    name: string;
    need_get_report: boolean;
    address: string;
  };
};

export type TSelectOption = {
  id?: string;
  title?: string;
  value?: string;
  label?: string;
};
