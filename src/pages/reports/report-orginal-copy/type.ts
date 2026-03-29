export type TData = {
  dateOne: Date;
  dateTwo: Date;
  deletedDate: null;
  id: string;
  title: string;
  price: number;
  date: Date;
  kv: number;
};

export type TStaticData = {
  savdoNarxi: number;
  savdoKv: number;
  terminal: number;
  inkasatsiya: number;
  qaytganKv: number;
  qaytganNarx: number;
  foyda1: number;
  foyda1Kv: number;
  navarRasxod:number;
  bossPrixod:number;
  bossRasxod:number;
  qolganPul:number;
  postavshik:number;
  postavshikTerminal:number;
  tamojnya:number;
  naqdDealer:number;
  naqdFilial:number;
  terminalDealer:number;
  bank:number;
  kredit:number;
  davlatlar: [
    {
      countryId: string;
      countryName: string;
      totalKv: number;
      totalPrice: number;
    },
    {
      countryId: string;
      countryName: string;
      totalKv: number;
      totalPrice: number;
    },
    {
      countryId: string;
      countryName: string;
      totalKv: number;
      totalPrice: number;
    },
  ];
  debts: [
    {
      fullName: string;
      totalDebt: number;
      monthlyOwed: number;
      monthlyGiven: number;
    },
  ];
  skidka: number;
  qarzgaSotilganKv: number;
  qarzgaSotilganNarx: number;
  magazinRasxod: number;
  navar: number;
  kelganQarzlar: number;
};

export type TQuery = {
  year?: number;
  month?: number;
  filialId?: string;
  page?: number;
  limit?: number;
};
