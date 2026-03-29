export interface ProductCharacteristic {
  id: string;
  collection: string;
  characteristics1: string;
  characteristics2: string;
  installmentParams: string;
  description: string;
}

export interface CharacteristicsQuery {
  search?: string | undefined;
  sortBy?: string | undefined;
  limit: number;
  page: number;
}
