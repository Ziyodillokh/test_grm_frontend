export type CurrencyData = {
  id: string;
  isActive: boolean;
  items: [
    {
      usd: number;
      uzs: number;
      id: string;
      date: string;
    },
  ];
};
export type WeatherData = {
  current: { temp_c: string; condition: { icon: string } };
  className: string[];
};
