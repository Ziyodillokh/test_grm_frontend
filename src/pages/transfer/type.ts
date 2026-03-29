enum progresEnum {
  book = "Booked",
  progress = "Processing",
  reject = "Rejected",
  accept = "Accepted",
  other = "other",
  accept_f= "Accepted_F"
}

export type TransferData = {
  transferer:{

    firstName:string;
    lastName:string;
     avatar: { path: string } 
  }
  number:number;
  courier: {
    firstName:string;
    lastName:string;
     avatar: { path: string } };
  biology_name: string;
  name: string;
  chats: [];
  createdAt: string;
  group:string;
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
  date:Date;
  progres: progresEnum;
  planting_time_end: string;
  planting_time_start: string;
  reels: [];
  updatedAt: string;
  updatedBy: string;
  variety: string;
};

export type TransferQuery = {
  limit: number;
  page: number;
  to?: string;
  from?: string;
  filial?: string;
  type?: string;
  search?:string;
  startDate?:Date;
  endDate?:Date;
  progress?:object;
};

export type TTransferCategory = {
  id: number;
  name: string;
};

export type TransferIdQuery = {
  populate: string;
};


export type orderProduct  ={
  product:string;
  x:number;
  isMetric:boolean;
  is_transfer:boolean;
}