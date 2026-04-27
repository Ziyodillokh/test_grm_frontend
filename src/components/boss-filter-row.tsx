import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";

import { FilialSelect } from "@/components/filters-ui/filial-select";
import { DavrSelect } from "@/components/filters-ui/davr-select";
import { useYear } from "@/store/year-store";
import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

interface BossFilterRowProps {
  /** Default month if URL not set */
  defaultMonth?: number;
  /** Hide filial picker (e.g. for F-manager) */
  hideFilial?: boolean;
  /** Children rendered after filters (e.g. Excel button) */
  children?: React.ReactNode;
}

/**
 * Shared filter row used by Boss Dashboard and Umumiy Hisobot.
 * URL keys: 'filial', 'month'. Year via Zustand `useYear()`.
 */
export default function BossFilterRow({
  defaultMonth = new Date().getMonth() + 1,
  hideFilial = false,
  children,
}: BossFilterRowProps) {
  const [filial, setFilial] = useQueryState("filial", parseAsString);
  const [month, setMonth] = useQueryState("month", parseAsInteger.withDefault(defaultMonth));
  const { year, setYear } = useYear();

  const { data: filialsResp } = useQuery({
    queryKey: [apiRoutes.filial, "boss-filter"],
    queryFn: () =>
      getAllData<any, any>(apiRoutes.filial, { type: "filial", limit: 200, page: 1 }),
    enabled: !hideFilial,
  });
  const filials: any[] = filialsResp?.items || filialsResp || [];

  return (
    <div className="flex items-center gap-[8px]">
      {!hideFilial && (
        <FilialSelect
          value={filial}
          onChange={setFilial}
          placeholder="Barchasi"
          filials={filials}
          showAllOption
          showDealersOption
        />
      )}

      <DavrSelect
        month={month || defaultMonth}
        year={year}
        onChangeMonth={setMonth}
        onChangeYear={setYear}
      />

      {children}
    </div>
  );
}
