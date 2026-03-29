export type TData = {
  id: string;
  fullName:string
  phone: string;
  comment: string;
  given:number;
  owed:number;  
  user: {
    id: string;
    isActive: true;
    firstName: string;
    lastName: string;
    fatherName: string;
    login:string;
    hired: string;
    from: string
    to: string;
    username: null;
    salary: 500;
    email: string;
    phone: string;
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
  limit?: number;
  page?: number;
  search?: string;
  filial?: string;
  filialId?: string;
};
