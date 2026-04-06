export interface ProductCharacteristic {
  id: string;
  title: string;
  description: string;
  paymentDeliveryInfo: string;
}

export interface CharacteristicsQuery {
  search?: string | undefined;
  sortBy?: string | undefined;
  limit: number;
  page: number;
}
