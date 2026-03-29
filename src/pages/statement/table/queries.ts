// table/queries.ts
import {
  DefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import { getAllData, getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

import { Statement, StatementQuery } from "../type";

interface IStatementQuery {
  options?: DefinedInitialDataInfiniteOptions<TResponse<Statement>>;
  queries?: StatementQuery;
}


const useStatementsData = ({ options, queries }: IStatementQuery) =>
  useInfiniteQuery({
    ...options,
    queryKey: [apiRoutes.payrolls, queries],
    queryFn: ({ pageParam = 10 }) =>
      getAllData<TResponse<Statement>, StatementQuery>(`${apiRoutes.payrolls}`, {
        ...queries,
        page: pageParam as number,
        limit: 50,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta?.currentPage <= lastPage?.meta?.totalPages) {
        return lastPage?.meta?.currentPage + 1;
      } else {
        return null;
      }
    },
    initialPageParam: 1,
  });
 export const useStatementsId = ({ id }: {id?:string | undefined}) =>
    useQuery({
      queryKey: [apiRoutes.payrolls,id],
      enabled:Boolean(id),
      queryFn: () =>
        getByIdData<Statement, StatementQuery>(`${apiRoutes.payrolls}`,id || ""),
   
    });

export const useStatementsDataDetail = ({
  queries,
}: IStatementQuery) =>
  useQuery({
    queryKey: [apiRoutes.payrollItems, queries],
    queryFn: () =>
      getAllData<TResponse<Statement>, StatementQuery>(`${apiRoutes.payrollItems}`,queries),
    enabled: !!queries?.payrollId,
  });

export default useStatementsData;
