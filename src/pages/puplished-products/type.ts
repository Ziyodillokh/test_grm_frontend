export interface qrBaseIMarkerData {
  isMetric: boolean;
  id: string;
  code: string;
  status: "draft" | "published" | "archived";
  i_price: number;
  date: string; // ISO date
  other_images: string[];

  country: BaseEntity;
  collection: BaseEntity;
  model: BaseEntity;
  style: BaseEntity;
  size: Size;
  shape: BaseEntity;
  factory: BaseEntity;
  color: BaseEntity;

  imgUrl: {
    path: string;
  };
  videoUrl: string | null;
  productsCount: number;
}

export interface BaseEntity {
  id: string;
  title: string;
  dateOne: string;
  dateTwo: string;
  deletedDate: string | null;
}

export interface Size extends BaseEntity {
  x: number;
  y: number;
  kv: number;
}
export interface CollectionData {
  i_price: any;
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

export type qrBaseIMarkerQuery = {
  search?: string | undefined;
  filialId?: string | undefined;
  filial?: string | undefined;
  country?: string | undefined;
  startDate?: Date | null;
  endDate?: Date | null;
  limit?: number;
  page?: number;
  status?: string | undefined;
};


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
