export type TData = {
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
  type: "filial";
  need_get_report: boolean;
  partiya_title: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  login: string;
};
export enum FilialReportStatusEnum {
  OPEN = "Open",
  ACCEPTED = "Accepted",
  CLOSED = "Closed",
  REJECTED = "Rejected",
}

export interface FilialReportData {
  id: string;
  date: string;
  dateOne:Date;
  dateTwo: Date;
  volume: number;
  cost: number;
  excel: string | null;
  status: FilialReportStatusEnum;
  filial: {};
  count:number;
}

export interface ProductDataOrder {
  id: string;
  x: number;
  isMetric: boolean;
  product: ProductData;
}

export interface ProductData {
  id: string;
  to?: string;
  from?: string;
  quantity: number;
  internetInfo: string | null;
  is_active: boolean;
  date: string;
  count: number;
  bar_code: {
    isMetric: boolean;
    id: string;
    code: string;
    imgUrl: string | null;
    otherImgs: string[] | null;
    internetInfo: string | null;
    is_active: boolean;
    date: string;
    model: {
      id: string;
      title: string;
    };
    color: {
      id: string;
      title: string;
      code: string;
    };
    collection: {
      id: string;
      title: string;
    };
    size: {
      id: string;
      title: string;
      x: number | null;
      y: number | null;
      kv: number | null;
    };
    shape: {
      id: string;
      title: string;
      meter: boolean;
    };
    style: {
      id: string;
      title: string;
    };
    country: {
      id: string;
      title: string;
    };
  };
  partiya: {
    title: string;
    id: string;
  };
  x: number;
  y: number;
  partiya_title: string;
}
export type ProductQuery = {
  search: string | undefined;
  limit: number;
  page: number;
  filialId?: string;
};

export type FilialsQuery = {
  title?: string;
  limit: number;
  page: number;
  type: string;
};
export interface TQuery {
  search?: string;
  limit?: number;
  page?: number;
  type?: string;
  filialId?: string;
  is_transfer?: boolean;
}
