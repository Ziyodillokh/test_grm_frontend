export interface TData {
  isMetric: boolean;
  id: string;
  code: string;
  imgUrl: string | null;
  otherImgs: string[] | null;
  internetInfo: string | null;
  is_active: boolean;
  date: string;
  count: number;
  y: number;
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
  factory: {
    id: string;
    title: string;
  };
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
  collection_price: {
    id: string;
    secondPrice: number;
    priceMeter: number;
    comingPrice: number;
    collection: {
      id: string;
      title: string;
    };
    date: string;
  };
  check_count: number;
  partiya: {
    id: string;
    title: string;
  };
  partiya_title: string;
  filial: {
    id: string;
    title: string;
  };
}
export type IProductCheckProductreport = {
  total: number;
  volume: number;
  count: number;
};
export type TQuery = {
  search?: string | undefined;
  limit?: number;
  page?: number;
  type?: string;
  filialId?: string;
};
