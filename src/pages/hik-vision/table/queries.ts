import { DefinedInitialDataOptions, useQuery } from "@tanstack/react-query";

import { BronedQuery } from "@/pages/broned/type";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponseUserLog } from "@/types";

import { TData } from "../type";

interface IBroned {
  options?: DefinedInitialDataOptions<TResponseUserLog<TData>>;
  queries?: BronedQuery;
}
const useLogTime = ({ options, queries }: IBroned) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.userLog, queries],
    queryFn: () =>
      getAllData<TResponseUserLog<TData>, BronedQuery>(
        apiRoutes.userLog,
        queries
      ),
  });

export default useLogTime;
