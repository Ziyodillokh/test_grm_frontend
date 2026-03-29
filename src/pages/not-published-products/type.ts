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
  sizeType: string;
  internetInfo: string;
  imgUrl: {
    path?: string
    id?: string
  };
  videoUrl: string | null;
  productsCount: number;
}

export interface BaseEntity {
  id: string;
  title: string;
  dateOne: string;
  description?: string;
  dateTwo: string;
  deletedDate: string | null;
}

export interface Size extends BaseEntity {
  x: number;
  y: number;
  kv: number;
}
export type ProductsQuery = {
  search?: string | undefined;
  filialId?: string | undefined;
  limit: number;
  page: number;
  isPublished?: boolean; // Added isPublished property to query
};
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
