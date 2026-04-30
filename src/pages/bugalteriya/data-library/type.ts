import type { TBarCode } from '@/types/qr-base';

export type TData = TBarCode;

export type TFormData = {
  country: {
    id: string;
    title: string;
  };
  collection: {
    id: string;
    title: string;
  };
  factory: {
    id: string;
    title: string;
  };
};

export interface TActionData {
  title: string;
  id: string;
  collection: {
    id: string;
    title: string;
  };
  code: string;
}

export interface TQuery {
  search: string | undefined;
  limit: number;
  page: number;
}
