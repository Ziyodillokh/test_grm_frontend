/**
 * QrBase / Barcode — yagona shared type.
 * Loyiha bo'ylab ishlatiluvchi unified shape (oldin TData / qrBaseIMarkerData parallel mavjud edi).
 */

export interface TBaseLookup {
  id: string;
  title: string;
  description?: string;
  dateOne?: string;
  dateTwo?: string;
  deletedDate?: string | null;
}

export interface TBarCodeSize extends TBaseLookup {
  x: number | null;
  y: number | null;
  kv: number | null;
}

export interface TBarCodeColor extends TBaseLookup {
  code?: string;
}

export interface TBarCodeMedia {
  id?: string;
  path?: string;
}

export type TBarCodeStatus = 'draft' | 'published' | 'not_ready' | 'NOT_READY' | 'PUBLISHED' | 'DRAFT';

export interface TBarCode {
  id: string;
  code: string;
  isMetric: boolean;
  status?: TBarCodeStatus | string;
  date?: string;

  /** Internet shop maydonlari */
  i_price?: number;
  secondPrice?: number;
  internetInfo?: string;
  internetTitle?: string;
  sizeType?: string;

  /** Relations */
  collection?: TBaseLookup;
  model?: TBaseLookup;
  color?: TBarCodeColor;
  size?: TBarCodeSize;
  shape?: TBaseLookup;
  style?: TBaseLookup;
  country?: TBaseLookup;
  factory?: TBaseLookup;

  /** Media (TypeORM relation — har doim object yoki null) */
  imgUrl?: TBarCodeMedia | null;
  videoUrl?: TBarCodeMedia | null;
  other_images?: TBarCodeMedia[];
  otherImgs?: string[] | null;

  /** Aggregat — i-market list response */
  productsCount?: number;
}

export interface TBarCodeQuery {
  search?: string;
  status?: string;
  filialId?: string;
  filial?: string;
  country?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  limit?: number;
  page?: number;
}
