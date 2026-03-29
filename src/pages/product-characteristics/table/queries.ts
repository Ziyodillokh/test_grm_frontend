import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { CharacteristicsQuery, ProductCharacteristic } from "../type";

interface ICharacteristicsQuery {
  options?: DefinedInitialDataInfiniteOptions<TResponse<ProductCharacteristic>>;
  queries?: CharacteristicsQuery;
}

const useCharacteristicsFetch = ({ options, queries }: ICharacteristicsQuery) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.collections, queries],
    queryFn: ({ pageParam = 1 }) => {
      return getAllData<TResponse<ProductCharacteristic>, CharacteristicsQuery>(
        apiRoutes.collections,
        {
          ...queries,
          page: pageParam as number,
          limit: 10,
        }
      );
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta?.currentPage < lastPage.meta?.totalPages) {
        return lastPage.meta?.currentPage + 1;
      } else {
        return undefined;
      }
    },
    initialPageParam: 1,
  });


export default useCharacteristicsFetch;