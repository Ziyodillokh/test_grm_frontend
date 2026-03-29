// Statement types
export type Statement = {
  createdAt: string;
  id: string;
  in_hand: number;
  number_payroll: number;
  plastic: number;
  premium: number;
  status: string;
  month: string;
  bonus: {
    title: string;
  };
  prepayment: number;
  award: {
    title:string;
  } ;
  title: string;
  to_date: string;
  total: number;
  user: {
    firstName: string;
    lastName: string;
    id: string;
    avatar: {
      path: string;
    };
    salary: number;
    filial: string;
  };
  payroll: {
    bonus: number;
    award: number;
    total: number;
    plastic: number;
    prepayment: number;
    in_hand: number;
  };
};

export type StatementItem = {
  dateOne: Date;
  dateTwo: Date;
  deletedDate: null;
  id: Date;
  createdAt: Date;
  total: number;
  plastic: number;
  in_hand: number;
  prepayment: number;
  selectedMonth: number;
  year: number;
  user: {
    dateOne: Date;
    dateTwo: Date;
    deletedDate: null;
    id: string;
    isActive: boolean;
    firstName: string;
    lastName: string;
    fatherName: string
    login:string;
    hired: Date;
    from: string;
    to: string;
    avatar:{
      path: string;
    }
    username: null;
    salary: number;
    email: null;
    phone: string
    isUpdated: boolean;
    createdAt: Date;
  };
  payroll: Statement;
  award: {
    id: string;
  };
  is_bonus: boolean;
  is_premium:boolean;
  bonus: {
    id: string;
  };
};

export type Statement1 = {
  id: string;
  number: string;
  name: string;
  createdAt: string;
  premiumsTotal: number;
  bonusesTotal: number;
  salaryTotal: number;
  totalSum: number;
  status: string;
};

// Employee in statement
export type StatementEmployee = {
  id: string;
  name: string;
  avatar?: string | null;
  filial: string;
  salary: number;
  bonus: number;
  premium: number;
  advance: number;
  total: number;
  plastic: number;
  cash: number;
};

// Query parameters for statements list
export type StatementQuery = {
  startDate?: string;
  payrollId?: string;
  endDate?: string;
  status?: string;
  search?: string;
  userId?: string;
  page?: number;
  limit?: number;
  filialId?: string;
};
