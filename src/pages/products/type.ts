export interface ProductsData {
  id: number;
  count: number;
  price: number;
  bar_code?: {
    code: string;
    imgUrl: {
      path?:string
    };
    collection: {
      title: string;
      collection_prices: {priceMeter:number}[]
    };
    model: {
      title: string;
    };
    size: {
      x: number;
      y: number;
    };
    shape: {
      title: string;
    };
    style: {
      title: string;
    };
    color: {
      title: string;
    };
    country: {
      title: string;
    };
    factory: {
      title: string;
    };
    partiya_no: {
      title: string;
    };
  };
  // Collection fields
  title?: string;
  imgUrl: {
    path?:string
  };
  model?: {
    title: string;
  };
  size?: {
    x: number;
    y: number;
  };
  shape?: {
    title: string;
  };
  color?: {
    title: string;
  };
}

export interface CollectionData {
  id: string;
  title: string;
  totalCount: number;
  totalKv: string;
  totalPrice: number;
  orderKv: string;
  collectionPrices: Array<{
    id: string;
    date: string;
    type: string;
    priceMeter: number;
    comingPrice: number;
    secondPrice: number;
    collectionId: string;
  }>;
}

export type ProductsQuery = {
  search?: string | undefined;
  url?: string | undefined;
  filialId?: string | undefined;
  filial?: string | undefined;
  country?: string | undefined;
  startDate?: Date | null;
  endDate?: Date | null;
  limit?: number;
  page?: number;
  enabled?: boolean;
};
