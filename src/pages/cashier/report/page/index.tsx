import { useEffect, useState } from "react";
import {
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  FileSpreadsheet,
  Plus,
  ArrowDown,
  ArrowUp,
  ClipboardCheck,
  Loader,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import qs from "qs";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useOpenKassa } from "@/pages/report/table/queries";
import { useCashflowFilial } from "@/pages/report/table/queries";
import { useMeStore } from "@/store/me-store";
import { apiRoutes } from "@/service/apiRoutes";
import { AddData, getAllData } from "@/service/apiHelpers";
import { formatNumber } from "@/utils/farmatNumber";
import { Spinner } from "@/components/ui/spinner";

import { useDataCashflow } from "../queries";
import { KassaPageColumns } from "./kassa-columns";
import type { CashflowType } from "@/components/adding-parish-flow";

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

export default function Page() {
  const { meUser } = useMeStore();
  const queryClient = useQueryClient();
  const [sort] = useQueryState("sort", parseAsString.withDefault("all"));
  const [sortSingle] = useQueryState(
    "sortSingle",
    parseAsString.withDefault("Все")
  );
  const [id, setId] = useQueryState("id");
  const [tip, setTip] = useQueryState("tip", parseAsString);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"parish" | "flow">("parish");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    setId(null);
  }, [sort]);

  const { data: reportData } = useOpenKassa({
    id: meUser?.filial?.id,
  });

  const { data: cashflowTotals } = useCashflowFilial({
    id: reportData?.id,
    enabled: Boolean(reportData?.id),
  });

  const { data: cashflowTypesData } = useQuery({
    queryKey: ["/cashflow-types/for/branch-manager"],
    queryFn: () => getAllData("/cashflow-types/for/branch-manager"),
    enabled: dialogOpen,
  });

  const { mutate: addCashflow, isPending } = useMutation({
    mutationFn: (data: any) => AddData(apiRoutes.cashflow, data),
    onSuccess: () => {
      toast.success(
        dialogType === "parish"
          ? "Kirim muvaffaqiyatli qo'shildi"
          : "Chiqim muvaffaqiyatli qo'shildi"
      );
      queryClient.invalidateQueries({ queryKey: [apiRoutes.openKassa] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflowFilial] });
      setDialogOpen(false);
    },
  });

  const { mutate: exportExcel, isPending: excelPending } = useMutation({
    mutationFn: async () => {
      const query = { kassaId: reportData?.id || id || undefined };
      const params = query
        ? `?${qs.stringify(query, { arrayFormat: "repeat" })}`
        : "";
      window.location.href =
        import.meta.env.VITE_BASE_URL + apiRoutes.excelCashflowsExcel + params;
    },
  });

  const cashflowStatus =
    sort === "all" ? undefined : sort === "pending" ? "pending" : "accepted";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        kassaId: reportData?.id || id || "",
        limit: 10,
        page: 1,
        // @ts-ignore
        tip: tipFilter[tip as string],
        // @ts-ignore
        type:
          sortSingle === "Все"
            ? typeFilter[tip as string]
            : sortSingle || typeFilter[tip as string],
        cashflowSlug: tip === "collection" ? "Инкассация" : undefined,
        status: cashflowStatus,
      },
      enabled: !!reportData?.id || Boolean(id),
    });

  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  const openDialog = (type: "parish" | "flow") => {
    setDialogType(type);
    setSelectedCategory("");
    setAmount("");
    setComment("");
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedCategory) {
      toast.error("Turni tanlang");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Summani kiriting");
      return;
    }
    addCashflow({
      price: parseFloat(amount),
      type: dialogType === "parish" ? "Приход" : "Расход",
      comment,
      casher: meUser?.id,
      kassa: reportData?.id,
      cashflow_type: selectedCategory,
      tip: "cashflow",
    });
  };

  const categories = (
    cashflowTypesData as unknown as CashflowType[]
  )?.filter(
    (ct) =>
      ct.type === (dialogType === "parish" ? "income" : "out") ||
      ct.type === "both"
  );

  const cards = [
    {
      label: "Umumiy sotuv",
      value: reportData?.sale || 0,
      dark: true,
    },
    { label: "Qarz savdosi", value: reportData?.debt_sum || 0 },
    { label: "Terminal", value: reportData?.plasticSum || 0 },
    {
      label: "Qaytarilgan",
      value: -(reportData?.return_sale || 0),
      orange: true,
    },
    {
      label: "Inkasatsiya",
      value: Math.abs(reportData?.cash_collection || 0),
    },
    { label: "Sotuv hajmi m²", value: reportData?.totalSize || 0 },
    {
      label: "Navar foydasi",
      value: reportData?.additionalProfitTotalSum || 0,
    },
    {
      label: "Chegirma",
      value: Number(reportData?.discount) || 0,
      orange: true,
    },
  ];

  const activeFilter = tip;

  const handleCardClick = (filterValue: string) => {
    setTip(activeFilter === filterValue ? null : filterValue);
  };

  return (
    <div className="px-4 pt-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <ClipboardCheck className="w-7 h-7" />
        <h1 className="text-[22px] font-semibold">Joriy Oy Kassasi</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-lg">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-lg">
            <ArrowUpDown className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-lg">
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg"
            onClick={() => exportExcel()}
            disabled={excelPending}
          >
            {excelPending ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-5 h-5" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => openDialog("parish")}
            className="bg-[#48B533] hover:bg-[#3da02b] text-white rounded-lg px-5 py-2.5 text-[14px] font-medium"
          >
            <Plus className="w-4 h-4 mr-1" />
            Kirim qo'shish
          </Button>
          <Button
            onClick={() => openDialog("flow")}
            className="bg-[#E38157] hover:bg-[#d0724a] text-white rounded-lg px-5 py-2.5 text-[14px] font-medium"
          >
            <Plus className="w-4 h-4 mr-1" />
            Chiqim qo'shish
          </Button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-3 mb-4">
        {/* Total card */}
        <div
          onClick={() => handleCardClick("")}
          className="bg-[#48B533] text-white rounded-xl p-5 min-w-[280px] cursor-pointer"
        >
          <p className="text-[32px] font-bold leading-tight">
            ${formatNumber(reportData?.in_hand || 0)}
          </p>
          <div className="flex items-center gap-4 mt-2 text-[14px] opacity-90">
            <span className="flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5" />$
              {formatNumber(cashflowTotals?.income || 0)}
            </span>
            <span className="flex items-center gap-1">
              <ArrowUp className="w-3.5 h-3.5" />$
              {formatNumber(cashflowTotals?.expense || 0)}
            </span>
          </div>
          <p className="text-[13px] mt-2 opacity-80">
            Saldo balans — ${formatNumber(reportData?.opening_balance || 0)}
          </p>
        </div>

        {/* Small cards 2x4 grid */}
        <div className="grid grid-cols-4 gap-2 w-full">
          {cards.map((card) => {
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
      <div className="h-[calc(100vh-340px)] scrollCastom">
        <DataTable
          columns={KassaPageColumns}
          data={flatData || []}
          isLoading={isLoading}
          hasHeader={true}
          isRowClickble={false}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="costomModal min-w-[494px] p-1 gap-0 rounded-[10px]">
          <div
            className={`p-1 h-[30px] pb-0 text-center mx-auto rounded-t-[7px] w-1/2 -mt-[35px] ${
              dialogType === "parish" ? "bg-[#89A143]" : "bg-[#E38157]"
            } text-white`}
          >
            {dialogType === "parish" ? "Kirim qo'shish" : "Chiqim qo'shish"}
          </div>

          <div className="flex gap-1">
            <div className="flex w-full max-w-[210px] items-start justify-start flex-wrap gap-1">
              {!categories ? (
                <div className="w-full flex justify-center items-center h-[181px]">
                  <Spinner />
                </div>
              ) : (
                categories?.map((ct) => (
                  <div
                    key={ct.id}
                    onClick={() => setSelectedCategory(ct.id)}
                    className={`w-[calc(50%-2px)] h-22 bg-input flex items-center justify-center flex-col rounded-[7px] text-center cursor-pointer ${
                      selectedCategory === ct.id
                        ? dialogType === "parish"
                          ? "ring-2 ring-[#89A143]"
                          : "ring-2 ring-[#E38157]"
                        : ""
                    }`}
                  >
                    <p className="text-primary text-[13px] font-medium mt-2.5">
                      {ct.title}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="w-full">
              <div className="flex pl-2 items-center bg-input rounded-[7px] h-[90px]">
                <Input
                  placeholder="0.00"
                  value={amount}
                  type="number"
                  min={0}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border-none h-[90px] placeholder:text-[32px] !text-[32px] font-semibold rounded-[7px] bg-transparent px-0"
                />
                <div className="text-4xl text-[#5D5D53] mx-4">$</div>
              </div>

              <Textarea
                placeholder="Izoh"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border-none focus:border-none outline-none shadow-none mt-0.5 h-[90px] text-[13px] bg-input font-semibold rounded-[7px] px-2 py-2.5"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending || !selectedCategory || !amount}
            className={`p-5 rounded-[7px] mt-1 ${
              dialogType === "parish" ? "bg-[#89A143]" : "bg-[#E38157]"
            } text-white`}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Qo'shilmoqda...
              </span>
            ) : dialogType === "parish" ? (
              "Kirimga qo'shish"
            ) : (
              "Chiqimga qo'shish"
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
