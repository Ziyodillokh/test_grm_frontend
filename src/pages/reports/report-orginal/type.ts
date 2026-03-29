type PriceKv = { price: number; kv: number };

export type TData = {
  turnover: PriceKv;
  debt_trading: PriceKv;
  discount: PriceKv;
  profit: PriceKv;
  cash: PriceKv;
  terminal: PriceKv;
  cash_collection: PriceKv;
  dealer_cash: PriceKv;
  dealer_terminal: PriceKv;
  owed_debt: PriceKv;
  opening_balance: PriceKv;
  filial_balance: PriceKv;
  boss_income: PriceKv;
  kent_income: PriceKv;
  kent_expense: PriceKv;
  boss_expense: PriceKv;
  business_expense: PriceKv;
  factory: PriceKv;
  return_orders: PriceKv;
  tamojniy: PriceKv;
  navar_expense: PriceKv;
  navar_income: PriceKv;
};

export type TQuery = {
  year?: number;
  month?: number;
  filialId?: string;
  page?: number;
  limit?: number;
};
