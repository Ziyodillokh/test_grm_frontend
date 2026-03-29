export type QRCode = {
    id: string;
    sequence: number;
    is_active: boolean;
    createdAt: string;
  };
  
  export type TabType = 'barcode' | 'qr' | string;
  
  export type QRGeneratorQuery = {
    limit?: number;
    page?: number;
    count?: number;
    prefix?: string;
    type?: TabType;
  };