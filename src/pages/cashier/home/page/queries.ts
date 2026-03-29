import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { IData, IQuery } from "../type";

interface ICrops {
  options?: DefinedInitialDataInfiniteOptions<TResponse<IData>>;
  queries?: IQuery;
  id?: string | undefined;
}

const useOrder = ({ options, queries, id }: ICrops) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.orderByKassa, queries, id],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<IData>, IQuery>(apiRoutes.orderByKassa + "/" + id, {
        ...queries,
        page: pageParam as number,
      }),
    enabled: Boolean(id),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta?.currentPage <= lastPage.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });

export default useOrder;
