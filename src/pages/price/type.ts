export interface ProductsData {
  isInternetShop: boolean;
  title: string;
  id: string;
  totalKv: number;
  code: string | null;
  count: number;
  booking_count: number;
  date: string;
  updated_at: string;
  price: number;
  secondPrice: number;
  priceMeter: number;
  collection_prices: [
    {
      comingPrice: number;
      secondPrice: number;
      priceMeter: number;
      collectionId: string;
    },
  ];
  comingPrice: number;
  draft_priceMeter: number;
  draft_comingPrice: number;
  x: number | null;
  y: number;
  totalSize: number | null;
  check_count: number;
  is_deleted: boolean;
  partiya_title: string;
  bar_code: {
    isMetric: boolean;
    id: string;
    code: string;
    imgUrl: string | null;
    otherImgs: string[] | null;
    internetInfo: any | null;
    is_active: boolean;
    is_accepted: boolean;
    date: string;
    country: {
      id: string;
      title: string;
    };
    collection: {
      id: string;
      title: string;
    };
    size: {
      id: string;
      title: string;
      x: number;
      y: number;
      kv: number;
    };
    shape: {
      id: string;
      title: string;
      meter: string;
    };
    style: {
      id: string;
      title: string;
    };
    color: {
      id: string;
      title: string;
    };
    model: {
      id: string;
      title: string;
    };
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
    phone2: string;
    isActive: boolean;
    hickCompleted: boolean;
    need_get_report: boolean;
    type: string;
  };
}

export interface ProductsQuery {
  search?: string;
  limit: number;
  page: number;
  filialId?: string;
}

export interface DiscountData {
  id: string;
  title: string;
  discountPercentage: number;
  isAdd: boolean;
}

export interface DiscountQuery {
  search?: string;
  limit: number;
  page: number;
  filialId?: string;
}