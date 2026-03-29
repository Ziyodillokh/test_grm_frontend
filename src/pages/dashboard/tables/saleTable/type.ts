export interface TData {
    id: string;
    price: number;
    x: number;
    date: string;
    plasticSum: number;
    seller: Person;
    casher: Person;
    isDebt: boolean;
    product: {
      isInternetShop: boolean;
      id: string;
      y: number;
    };
    bar_code: {
      isMetric: boolean;
      id: string;
      code: string;
      collection: BaseTitleEntity;
      model: BaseTitleEntity;
      size: BaseTitleEntity;
      color: BaseTitleEntity;
    };
  }
  
  export interface TransferItem {
    isChecked: boolean;
    dateOne: string;
    dateTwo: string;
    deletedDate: string | null;
    id: string;
    title: string;
    count: number;
    date: string;
    comingPrice: number;
    oldComingPrice: number;
    kv: number;
    for_dealer: boolean;
    group: string;
    order_index: number;
    product: {
      bar_code: {
        isMetric: boolean;
        id: string;
        code: string;
        collection: BaseTitleEntity;
        model: BaseTitleEntity;
        size: BaseTitleEntity;
        color: BaseTitleEntity;
      };
    };
    transferer: Person;
    manager: Person;
    courier: Person | null;
  }
  
  
interface Person {
    id: string;
    firstName: string;
    lastName: string;
    avatar: Avatar;
  }
  
interface Avatar {
    id: string;
    path: string;
    mimetype: string;
    name: string;
  }
  
interface BaseTitleEntity {
    id: string;
    title: string;
  }
  

export interface TQuery {
  limit: number;
  page: number;
  type?: string;
  user_id?: string;
  filial?: string;
  month?: string;
  year?: number;
}

export interface ITotal {
  totals: {
    total_sum:number;
    total_count: number;
    total_additional_profit_sum: number;
    total_profit_sum:number;
    total_kv: number;
  };
}
