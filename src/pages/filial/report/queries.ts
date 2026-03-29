import { DefinedInitialDataOptions, useQuery } from "@tanstack/react-query";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { FilialReportData, ProductQuery } from "../type";

interface IData {
  options?: DefinedInitialDataOptions<TResponse<FilialReportData>>;
  queries?: ProductQuery;
}
const useDataFetch = ({ options, queries }: IData) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.filialReport, queries],
    queryFn: () =>
      getAllData<TResponse<FilialReportData>, ProductQuery>(apiRoutes.filialReport, queries),
  });

export default useDataFetch;
