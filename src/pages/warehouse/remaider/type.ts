

type Meta = {
  pagination:{
    hasNext:boolean
    hasPrev:boolean
    limit:number
    page:number
    total:number
    totalPages:number
  },
  totals:{
    totalCount: number;
    totalKv: number;
    totalPrice: number;
    totalSellCount: number;
    totalSellKv: number;
    totalSellPrice: number;
  }
}


export interface SalesData {
  collection: {
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
  id?: string;
  title?: string
  totalCount: number;
  totalKv: number;
  totalPrice: number;
  totalKvPrice?: number;
  totalSellCount: number;
  totalSellKv: number;
  totalSellPrice: number;
}

export interface ICountryReportData {
  data: SalesData[];
  meta: Meta
}

export interface IModelData {
  items: SalesData[];
  meta: Meta
}

export interface TQuery {
  search?: string | undefined;
  filialId?: string;
  country?:string;
  factory?:string;
  kassaId?: string;
  limit?: number;
  page?: number;
  id?: string;
  month?:string;
  year?:number;
  startDate?: Date | null;
  endDate?: Date | null;
  to?: Date | null;
  from?: Date | null;
  type?: string;
  collectionId?:string;
  model?:string;
}

