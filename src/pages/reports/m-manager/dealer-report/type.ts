export interface TData {
  id: number;
  type: string;
  amount: number;
  tip: string;
  product: string;
  code?: string;
  size?: string;
  price?: number;
  comment: string;
  quantity?: number;
  discount?: string;
  description?: string;
  operation: string;
  time: string;
  is_online?:Boolean;
  title: string;
  date: string;
  filial:{
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
    phone2: string;
    isActive: boolean;
    hickCompleted: boolean;
    need_get_report: boolean;
    type: "filial";
  }
  cashflow_type:{
    id: string;
    title: string;
    slug: string;
    type: string;
    is_visible: boolean;
}
  casher:{
    avatar: {
      id: string;
      path: string;
      model: string;
      mimetype: string;
      size: number;
      name: string;
      created_at: string;
  }
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
}
order: {
  id: string;
  status: "canceled" | "pending" | "completed";
  comment: string | null;
  price: number;
  x: number;
  kv: number;
  date: string;
  additionalProfitSum: number;
  netProfitSum: number;
  discountSum: number;
  discountPercentage: string;
  tip: string;
  plasticSum: number;
  seller: {
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
  }
  };
  bar_code: {
    isMetric: boolean;
    id: string;
    code: string;
    imgUrl: string | null;
    otherImgs: string | null;
    internetInfo: string | null;
    is_active: boolean;
    is_accepted: boolean;
    date: string;
    collection: {
      id: string;
      title: string;
      secondPrice: number;
      priceMeter: number;
      comingPrice: number;
    };
    color:{
      title:string
    }
    size: {
      id: string;
      title: string;
      x: number;
      y: number;
      kv: number;
    };
    model: {
      id: string;
      title: string;
    };
  };
}
}
export interface TQuery {
  search?: string | undefined;
  kassaId?: string | undefined;
  casherId?: string | undefined;
  filialId?: string;
  kassaReport?:string | undefined;
  limit: number;
  page: number;
  fromDate?: Date | null;
  toDate?: Date | null;
}


