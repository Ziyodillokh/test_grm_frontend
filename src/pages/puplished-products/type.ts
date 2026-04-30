import type { TBarCode, TBaseLookup, TBarCodeSize } from '@/types/qr-base';

export type qrBaseIMarkerData = TBarCode;

export type BaseEntity = TBaseLookup;
export type Size = TBarCodeSize;

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
