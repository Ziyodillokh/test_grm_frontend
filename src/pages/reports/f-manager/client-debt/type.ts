export interface TData {
  id: string;
  status: string;
  comment: string | null;
  price: number;
  x: number;
  kv: number;
  date: string;
  additionalProfitSum: number;
  netProfitSum: number;
  discountSum: number;
  discountPercentage: string;
  tip: string;
  isDebt: boolean;
  plasticSum: number;
  seller: Seller;
  product: Product;
  client:Client
};

type Client = {
  id: string;
  fullName: string;
  phone: string;
  given: number;
  owed: number;
  comment: string | null;
};



type Seller = {
  id: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  fatherName: string;
  login: string;
  hired: string;
  from: string;
  to: string;
  username: string | null;
  salary: number;
  email: string | null;
  phone: string;
  password: string;
  isUpdated: boolean;
  createdAt: string;
  avatar: Avatar;
};

type Avatar = {
  id: string;
  path: string;
  model: string;
  mimetype: string;
  size: number;
  name: string;
  created_at: string;
};

type Product = {
  isInternetShop: boolean;
  id: string;
  code: string;
  count: number;
  booking_count: number;
  date: string;
  updated_at: string;
  price: number;
  secondPrice: number;
  priceMeter: number;
  comingPrice: number;
  draft_priceMeter: number;
  draft_comingPrice: number;
  x: number;
  y: number;
  totalSize: number;
  check_count: number;
  is_deleted: boolean;
  partiya_title: string;
  book_count: number;
  collection_price: number | null;
  bar_code: BarCode;
};

type BarCode = {
  isMetric: boolean;
  id: string;
  code: string;
  otherImgs: any | null;
  internetInfo: any | null;
  is_active: boolean;
  is_accepted: boolean;
  date: string;
  model: {
    id: string;
    title: string;
  };
  collection: {
    id: string;
    title: string;
    secondPrice: number;
    priceMeter: number;
    comingPrice: number;
  };
  size: {
    id: string;
    title: string;
    x: number;
    y: number;
    kv: number;
  };
};


export interface TQuery {
  filialId?: string;
  page?:number;
  limit:number
}
