import type { TBarCode, TBaseLookup, TBarCodeSize } from '@/types/qr-base';

export type qrBaseIMarkerData = TBarCode;

export type BaseEntity = TBaseLookup;
export type Size = TBarCodeSize;

export type ProductsQuery = {
  search?: string | undefined;
  filialId?: string | undefined;
  limit: number;
  page: number;
  isPublished?: boolean;
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
