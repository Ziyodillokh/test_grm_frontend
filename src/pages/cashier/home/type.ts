export interface IData {
  id: string;
  status: string;
  title: string;
  price: number;
  x: number;
  comment:string;
  kv: number;
  date: string;
  additionalProfitSum: number;
  netProfitSum: number;
  discountPercentage: string;
  tip: string;
  type: string;
  plasticSum: number;
  discountSum: number;
  isDebt: boolean;
  seller: {
    id: string;
    isActive: boolean;
    avatar: any;
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
  };
  bar_code: {
    isMetric: boolean;
    id: string;
    code: string;
    imgUrl: string | null;
    otherImgs: string | null;
    internetInfo: string | null;
    is_active: boolean;
    is_accepted: boolean;
    date: string;
  };
  product: {
    isInternetShop: boolean;
    id: string;
    code: string | null;
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
    x: number | null;
    y: number;
    totalSize: number | null;
    check_count: number;
    is_deleted: boolean;
    partiya_title: string;

    book_count: number;
    collection_price: {
      priceMeter: number;
    };
    bar_code: {
      isMetric: boolean;
      id: string;
      code: string;
      imgUrl: { path: string | null };
      otherImgs: string | null;
      internetInfo: string | null;
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
        collection_prices: [{ priceMeter: number }];
      };
      color: {
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
      country: {
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
  };
  kassa: {
    id: string;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
    totalSum: number;
    additionalProfitTotalSum: number;
    netProfitTotalSum: number;
    totalSize: number;
    plasticSum: number;
    cashFlowSumBoss: number;
    income: number;
    expense: number;
    cashFlowSumShop: number;
    expenditureBoss: number;
    expenditureShop: number;
    internetShopSum: number;
    status: string;
  };
}

export type IQuery = {
  isActive?: string | undefined;
  sellerId?: string | undefined;
  status?: string;
  limit?: number;
  page?: number;
  startDate?: string;
  endDate?: string;
};
