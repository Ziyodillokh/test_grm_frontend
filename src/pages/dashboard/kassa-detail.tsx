import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import { ArrowLeft, ArrowDown, ArrowUp } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { useDataCashflow } from "@/pages/cashier/report/queries";
import { KassaPageColumns } from "@/pages/cashier/report/page/kassa-columns";
import { apiRoutes } from "@/service/apiRoutes";
import { getByIdData } from "@/service/apiHelpers";
import { TKassareportData } from "@/pages/reports/m-manager/report-finance/type";
import { formatNumber } from "@/utils/farmatNumber";

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
  const [tip, setTip] = useQueryState("tip", parseAsString);
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

  const cards = [
    { label: "Umumiy sotuv", value: kassaData?.sale || 0, dark: true },
    { label: "Qarz savdosi", value: kassaData?.debt_sum || 0 },
    { label: "Terminal", value: kassaData?.plasticSum || 0 },
    { label: "Qaytarilgan", value: -(kassaData?.return_sale || 0), orange: true },
    { label: "Inkasatsiya", value: Math.abs(kassaData?.cash_collection || 0) },
    { label: "Sotuv hajmi m²", value: kassaData?.totalSize || 0 },
    { label: "Navar foydasi", value: kassaData?.additionalProfitTotalSum || 0 },
    { label: "Chegirma", value: Number(kassaData?.discount) || 0, orange: true },
  ];

  const activeFilter = tip;

  const filterMap: Record<string, string> = {
    "Umumiy sotuv": "sale",
    "Qarz savdosi": "sale",
    Terminal: "terminal",
    Qaytarilgan: "return",
    Inkasatsiya: "collection",
    "Sotuv hajmi m²": "sale",
    "Navar foydasi": "navar",
    Chegirma: "discount",
  };

  const handleCardClick = (filterValue: string) => {
    setTip(activeFilter === filterValue ? null : filterValue);
  };

  return (
    <div className="px-4 pt-2">
      {/* Breadcrumb */}
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

      {/* Cards */}
      <div className="flex gap-3 mb-4">
        {/* Total card */}
        <div
          onClick={() => handleCardClick("")}
          className="bg-[#48B533] text-white rounded-xl p-5 min-w-[280px] cursor-pointer"
        >
          <p className="text-[32px] font-bold leading-tight">
            ${formatNumber(kassaData?.in_hand || 0)}
          </p>
          <div className="flex items-center gap-4 mt-2 text-[14px] opacity-90">
            <span className="flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5" />${formatNumber(kassaData?.income || 0)}
            </span>
            <span className="flex items-center gap-1">
              <ArrowUp className="w-3.5 h-3.5" />${formatNumber(kassaData?.expense || 0)}
            </span>
          </div>
          <p className="text-[13px] mt-2 opacity-80">
            Saldo balans — ${formatNumber(kassaData?.opening_balance || 0)}
          </p>
        </div>

        {/* Small cards 2x4 grid */}
        <div className="grid grid-cols-4 gap-2 w-full">
          {cards.map((card) => {
            const filterVal = filterMap[card.label] || "";
            const isActive = activeFilter === filterVal && filterVal !== "";

            return (
              <div
                key={card.label}
                onClick={() => handleCardClick(filterVal)}
                className={`rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                  card.orange
                    ? isActive
                      ? "bg-[#c46d3f] text-white"
                      : "bg-[#E38157] text-white"
                    : card.dark
                      ? isActive
                        ? "bg-[#2d5a1f] text-white"
                        : "bg-[#3d6b2e] text-white"
                      : isActive
                        ? "bg-primary text-background"
                        : "bg-card border border-border"
                }`}
              >
                <p className="text-[16px] font-bold">
                  {card.value < 0 ? "-" : ""}
                  {formatNumber(Math.abs(card.value))}
                </p>
                <p className="text-[12px] mt-1 opacity-70">{card.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="h-[calc(100vh-280px)] scrollCastom">
        <DataTable
          columns={KassaPageColumns.filter(col => col.id !== 'harakatlar')}
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
