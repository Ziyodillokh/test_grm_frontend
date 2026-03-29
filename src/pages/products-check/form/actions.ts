import { DefinedInitialDataOptions, useQuery } from "@tanstack/react-query";

import { TData } from "@/pages/bugalteriya/data-library/type";
import { getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { ProductsChecksQuery } from "../type";

interface IProductsChecks {
  options?: DefinedInitialDataOptions<TData>;
  id: string | undefined;
  queries?: ProductsChecksQuery;
}

export const useProductsCheckById = ({
  options,
  id,
  queries,
}: IProductsChecks) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.qrBaseCode, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<TData, ProductsChecksQuery>(
        apiRoutes.qrBaseCode,
        id || "",
        queries
      ),
  });
