
export interface TKassareportData {
  id: string;
  totalSellCount: number;
  additionalProfitTotalSum: number;
  netProfitTotalSum: number;
  totalSize: number;
  kassaReportStatus:number;
  year: number;
  month: number;
  status: string;
  filial?: {
    id: string;
    title: string;
  };
  kassaReport?:TKassareportData[];
  reportStatus?:number;
  totalPlasticSum: number;
  totalInternetShopSum: number;
  totalSale: number;
  totalSaleReturn: number;
  totalCashCollection: number;
  totalDiscount: number;
  totalIncome: number;
  totalExpense: number;
  totalSum: number;
  in_hand:number;
  debt_sum:number;
}

export interface TQuery {
  search?: string | undefined;
  filialId?: string;
  kassaId?: string;
  limit?: number;
  page?: number;
  id?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  type?:string;
  year?:number;
}


export interface TTotalDebt {
  totalDebt: number
}