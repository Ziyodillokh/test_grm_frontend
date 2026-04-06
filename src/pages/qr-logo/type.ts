export interface QrLogo {
  id: string;
  link: string;
  description: string | null;
  is_active: boolean;
  qrDataUrl: string | null;
  createdAt: string;
}

export interface QrLogoQuery {
  page: number;
  limit: number;
  is_active?: string;
}
