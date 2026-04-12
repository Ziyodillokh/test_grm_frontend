export interface DealerReportItem {
  id: string;
  title: string;
  owed: number;
  given: number;
}

export interface DealerReportQuery {
  year?: number;
  search?: string;
  page?: number;
  limit?: number;
  type?: string;
}

export interface DealerReportResponse {
  items: DealerReportItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemCount: number;
  };
}
