import { useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

interface IKassaTotalsQuery {
  filialId?: string;
  year?: number;
}

export const useKassaTotals = ({
  queries,
  enabled,
}: {
  queries?: IKassaTotalsQuery;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [apiRoutes.kassaTotals, queries],
    enabled,
    queryFn: () =>
      getAllData<Record<string, number>, IKassaTotalsQuery>(
        apiRoutes.kassaTotals,
        queries
      ),
  });
