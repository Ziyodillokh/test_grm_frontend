import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import { ArrowLeft } from "lucide-react";

import CardSort from "@/components/card-sort";
import { DataTable } from "@/components/ui/data-table";
import { useDataCashflow } from "@/pages/cashier/report/queries";
import { ReportColumns } from "@/pages/cashier/report/page/columns";
import { apiRoutes } from "@/service/apiRoutes";
import { getByIdData } from "@/service/apiHelpers";
import { TKassareportData } from "@/pages/reports/m-manager/report-finance/type";

const tipFilter: Record<string, string> = {
  income: "cashflow",
  expense: "cashflow",
  sale: "order",
  return: "order",
  terminal: "Терминал",
  discount: "Скидка",
  navar: "Навар",
};
const typeFilter: Record<string, string> = {
  income: "Приход",
  expense: "Расход",
  sale: "Приход",
  return: "Расход",
};

export default function DashboardKassaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sort] = useQueryState("sort", parseAsString.withDefault("all"));
  const [tip] = useQueryState("tip", parseAsString);
  const [sortSingle] = useQueryState(
    "sortSingle",
    parseAsString.withDefault("Все")
  );

  // Kassa ma'lumotlarini olish (GET /kassa/:id)
  const { data: kassaData } = useQuery({
    queryKey: [apiRoutes.kassa, id],
    queryFn: () =>
      getByIdData<TKassareportData, object>(apiRoutes.kassa, id || ""),
    enabled: Boolean(id),
  });

  const cashflowStatus =
    sort === "all" ? undefined : sort === "pending" ? "pending" : "accepted";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        kassaId: id || "",
        limit: 10,
        page: 1,
        tip: tipFilter[tip as string],
        type:
          sortSingle === "Все"
            ? typeFilter[tip as string]
            : sortSingle || typeFilter[tip as string],
        cashflowSlug: tip === "collection" ? "Инкассация" : undefined,
        status: cashflowStatus,
      },
      enabled: Boolean(id),
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  return (
    <div className="p-4">
      {/* Breadcrumb: ← Joriy Oy > Filial nomi */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <ArrowLeft
          className="w-5 h-5 cursor-pointer hover:text-foreground text-muted-foreground"
          onClick={() => navigate("/m-manager/current-month")}
        />
        <span
          className="cursor-pointer hover:text-foreground text-muted-foreground"
          onClick={() => navigate("/m-manager/current-month")}
        >
          Joriy Oy
        </span>
        <span className="text-muted-foreground">•</span>
        <span className="text-foreground font-medium">
          {kassaData?.filial?.title || kassaData?.filial?.name || "Kassa"}
        </span>
      </div>

      <CardSort
        KassaReport={kassaData as any}
        KassaId={id || ""}
        isKassa={false}
      />

      <div className="h-[calc(100vh-330px)] scrollCastom">
        <DataTable
          columns={ReportColumns}
          data={flatData || []}
          isLoading={isLoading}
          hasHeader={false}
          isRowClickble={false}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
