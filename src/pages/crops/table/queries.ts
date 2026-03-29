import { useInfiniteQuery, DefinedInitialDataInfiniteOptions } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";
import { CropData, CropQuery } from "../type";

interface ICrops {
  options?: DefinedInitialDataInfiniteOptions<TResponse<CropData>>;
  queries?: CropQuery;
}

const useCrops = ({ options, queries }: ICrops) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.productReport, queries],
    queryFn: ({ pageParam = 1 }) =>
      getAllData<TResponse<CropData>, CropQuery>(apiRoutes.productReport,
         { ...queries, page: pageParam as number, limit: 10}
        ),
    getNextPageParam: (lastPage) => lastPage?.meta?.currentPage + 1 || null,
    initialPageParam: 1 
  });

export default useCrops;
