export type ProductsChecksData = {
  id: string;
  name: string;
  code: string;
  country: {
    title: string;
  };
  model: {
    id: string;
    title: string;
    collection: {
      id: string;
      title: string;
    };
  };
  size: string;
  count: string;
  shape: string;
  style: string;
  color: {
    id: string;
    title: string;
    code: string;
  };
  price: string;
};

export type ProductsChecksQuery = {
  search: string | undefined;
  limit: number;
  page: number;
  id?: string;
};
