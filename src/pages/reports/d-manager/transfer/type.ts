enum progresEnum {
  book = "Booked",
  progress = "Processing",
  reject = "Rejected",
  accept = "Accepted",
  other = "other",
  accept_f = "Accepted_F",
}

export type TransferData = {
  dateOne: Date;
  dateTwo: Date;
  deletedDate: null;
  id: string;
  total_kv: number;
  total_profit_sum: number;
  total_sum: number;
  total_count: number;
  status: string;
  title: string;
  
  dealer: {
    dateOne: Date;
    dateTwo: Date;
    deletedDate: null;
    id: string;
    title: string;
    given: number;
    owed: number;
    name: null;
    telegram: null;
    address: string;
    startWorkTime: null;
    endWorkTime: null;
    test: false;
    isDeleted: false;
    addressLink: null;
    landmark: null;
    phone1: string;
    phone2: null;
    isActive: true;
    hickCompleted: true;
    need_get_report: false;
    type: string;
  };
  from: {
    dateOne: Date;
    dateTwo: Date;
    deletedDate: null;
    id: Date;
    title: string;
    given: number;
    owed: number;
    name: string;
    telegram: string;
    address: string;
    startWorkTime: string;
    endWorkTime: string;
    test: false;
    isDeleted: false;
    addressLink: string;
    landmark: string;
    phone1: string;
    phone2: string;
    isActive: true;
    hickCompleted: true;
    need_get_report: false;
    type: string;
  };
  d_manager: {
    dateOne: Date;
    dateTwo: Date;
    deletedDate: null;
    id: string;
    isActive: true;
    firstName: string;
    lastName: string;
    fatherName: string;
    login: string;
    hired: null;
    from: null;
    to: null;
    username: null;
    salary: null;
    email: null;
    phone: null;
    password: string;
    isUpdated: true;
    createdAt: Date;
  };
  courier: {
    dateOne: Date;
    dateTwo: Date;
    deletedDate: null;
    id: string;
    isActive: true;
    firstName: string;
    lastName: string;
    fatherName: string;
    login: string;
    hired: null;
    from: null;
    to: null;
    username: null;
    salary: null;
    email: null;
    phone: null;
    password: string;
    isUpdated: true;
    createdAt: Date;
  };
};
export type TransferDealerData = {
  transferer: {
    firstName: string;
    lastName: string;
    avatar: { path: string };
  };
  number?:number;
  courier: {
    firstName: string;
    lastName: string;
    avatar: { path: string };
  };
  biology_name: string;
  name: string;
  chats: [];
  createdAt: string;
  group: string;
  createdBy: string;
  transfer_category: TTransferCategory;
  transfer_code: string;
  description: string;
  details: string;
  gallery: [];
  type: string;
  harvest_duration: number;
  id: string;
  is_common: boolean;
  product: {
    bar_code: {
      size: {
        x: number;
      };
      isMetric: boolean;
    };
    y: number;
  };
  count: string;
  main_image: {
    aws_path: string;
  };
  date: Date;
  progres: progresEnum;
  planting_time_end: string;
  planting_time_start: string;
  reels: [];
  updatedAt: string;
  updatedBy: string;
  variety: string;
};

export type TTransferCategory = {
  id: number;
  name: string;
};

export type TransferCollectionDealerData = {
  id: string;
  title:string;
  total_kv: string;
  total_count: string;
  comingPrice:string;
  total_profit_sum: string;
  collection_prices: 
    {
      id: string;
      date: string;
      type: string;
      dateOne: string;
      dateTwo: string;
      priceMeter: number;
      comingPrice: number;
      deletedDate: null;
      secondPrice: number;
      collectionId: string;
    }[]};
export type TransferQuery = {
  limit: number;
  page: number;
  to?: string;
  package_id?: string;
  from?: string;
  filial?: string;
  dealer?: string;
  type?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  progress?: object;
  mode?: string;
  toId?: string;
  month?:string;
  year?:number
};
