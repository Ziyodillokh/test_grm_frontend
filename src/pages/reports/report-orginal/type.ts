type PriceKv = { price: number; kv: number };

export type TData = {
  turnover: PriceKv;
  debt_trading: PriceKv;
  discount: PriceKv;
  profit: PriceKv;
  profit_remaining: PriceKv;    // foyda qoldig'i = foyda - biznes rasxod
  cash: PriceKv;
  terminal: PriceKv;
  cashCollection: PriceKv;
  dealer_cash: PriceKv;
  dealer_terminal: PriceKv;
  owed_debt: PriceKv;
  openingBalance: PriceKv;
  filial_balance: PriceKv;
  manager_balance: PriceKv;     // manager balansi
  accountant_balance: PriceKv;  // bugalter balansi
  boss_income: PriceKv;
  kent_income: PriceKv;
  kent_expense: PriceKv;
  boss_expense: PriceKv;
  business_expense: PriceKv;
  logistics: PriceKv;           // logistika (alohida)
  extra_income: PriceKv;        // qo'shimcha prixodlar
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
