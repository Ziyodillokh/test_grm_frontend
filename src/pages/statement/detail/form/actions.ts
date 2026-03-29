import {
  DefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import { AddData, getByIdData, UpdateData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import {  StatementItem, StatementQuery } from "../../type";
import { PayrollItemFormType } from "./schema";



interface IPayrollItems {
  options?: DefinedInitialDataOptions<StatementItem>;
  id: string | undefined;
  queries?: StatementQuery;
}
interface IPayrollItemsMute {
  data: PayrollItemFormType;
  id: string | undefined;
}

export const usePayrollItemMutation = ({
  ...options
}: UseMutationOptions<object, Error, IPayrollItemsMute, unknown>) =>
  useMutation({
    ...options,
    mutationFn: async ({ data, id }) => {
      const costomData: object = {
        ...data,
      };
      if (id)
        return await UpdateData<PayrollItemFormType>(
          apiRoutes.payrollItems,
          id,
          costomData as PayrollItemFormType
        );
      return await AddData<PayrollItemFormType>(
        apiRoutes.payrollItems,
        costomData as PayrollItemFormType
      );
    },
  });

export const usePayrollItemById = ({ options, id, queries }: IPayrollItems) =>
  useQuery({
    ...options,
    queryKey: [apiRoutes.payrollItems, id],
    enabled: Boolean(id),
    queryFn: () =>
      getByIdData<StatementItem, StatementQuery>(apiRoutes.payrollItems, id || "", queries),
  });
