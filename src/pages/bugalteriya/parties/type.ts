enum PartiyaStatusEnum {
  NEW = 'new',
  PENDING = 'pending',
  CLOSED = 'closed',
}
export type TData = {
  id: string;
  biology_name: string;
  name: string;
  date: string;
  volume: string;
  expense: string;
  chats: [];
  createdAt: string;
  createdBy: string;
  Partiya_category: TPartiyaCategory;
  Partiya_code: string;
  description: string;
  details: string;
  gallery: [];
  harvest_duration: number;
  is_common: boolean;
  main_image: {
    aws_path: string;
  };
  partiya_status: PartiyaStatusEnum;
  planting_time_end: string;
  planting_time_start: string;
  reels: [];
  updatedAt: string;
  updatedBy: string;
  variety: string;
  factory?:{
    title:string
  }
  partiya_no?:{
    title:string
  }
};

export interface TSingleData {
  id: string;
  expense: number;
  volume: number;
  expensePerKv: number;
  date: string; // ISO Date string
  check: boolean;
  finished: boolean;
  partiya_status: string; // JSON string, ideally should be parsed to an object
  warehouse: {
    id: string;
    title: string;
    given: number;
    owed: number;
    name: string;
    telegram: string;
    address: string;
    startWorkTime: string;
    endWorkTime: string;
    test: boolean;
    isDeleted: boolean;
    addressLink: string;
    landmark: string;
    phone1: string;
    phone2: string | null;
    isActive: boolean;
    hickCompleted: boolean;
    need_get_report: boolean;
    type: "warehouse" | string;
  };
  country: {
    id: string;
    title: string;
  };
  factory: {
    id: string;
    title: string;
  };
  partiya_no:{
    id: string;
    title: string;
  }
  user: {
    id: string;
    isActive: boolean;
    firstName: string;
    lastName: string;
    fatherName: string;
    login: string;
    hired: string; // ISO Date string
    from: string;
    to: string;
    username: string | null;
    salary: number;
    email: string | null;
    phone: string;
    password: string;
    isUpdated: boolean;
    createdAt: string;
  };
}


export type TQuery = {
  search?: string | undefined;
  limit: number;
  page: number;
  country?: string | undefined,
  partiya_no?: string | undefined,
  factory?: string | undefined,
  warehouse?: string | undefined,
};

export type TPartiyaCategory = {
  id: number;
  name: string;
};

export type PartiyaIdQuery = {
  populate: string;
};
