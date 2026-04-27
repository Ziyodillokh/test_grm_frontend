import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { Plus, ArrowDown, ArrowUp, X, Loader } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import qs from "qs";

import Filter from "./filter";
import CardSort from "@/components/card-sort";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
import debounce from "@/utils/debounce";
import {
  parseAsBoolean,
  parseAsIsoDate,
  parseAsString,
  useQueryState,
} from "nuqs";
import { useKassaReportTotal } from "../../f-manager/report/queries";
import { useDataCashflow } from "./queries";
import { Columns } from "./columns";
import { useParams } from "react-router-dom";
import { useMeStore } from "@/store/me-store";
import { useKassaReportSingle } from "../filial-report-finance/queries";
import { useCashflowForMainManager, useReportsSingle } from "../report-finance-single/queries";
import { useYear } from "@/store/year-store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { apiRoutes } from "@/service/apiRoutes";
import { getAllData } from "@/service/apiHelpers";
import api from "@/service/fetchInstance";
import type { CashflowType } from "@/components/adding-parish-flow";
import { minio_img_url } from "@/constants";
import ShadcnSelect from "@/components/Select";
import useDeblsData from "@/pages/debt/table/queries";
import UpdateCashflowDialog from "./update-cashflow-dialog";
import { CashflowRow as MyCashflowRow, cashflowGridTemplate as myCashflowGridTemplate, cashflowLabels as myCashflowLabels } from "@/components/cashflow-row";

export default function ReportPage() {
  const tipFilter = {
    income: "cashflow",
    expense: "cashflow",
    sale: "order",
    return: "order",
    terminal:"terminal",
    discount:"discount",
    navar:"markup",
  };

  const typeFilter = {
    income: "Приход",
    expense: "Расход",
    sale: "Приход",
    return: "Расход",
  };

  const { id, kassaId } = useParams();

  const [myCashFlow] = useQueryState(
    "myCashFlow",
    parseAsBoolean.withDefault(false)
  );

  const [FManagerCashFlow] = useQueryState(
    "FManagerCashFlow",
    parseAsBoolean.withDefault(false)
  );

  const { meUser } = useMeStore();
  const queryClient = useQueryClient();
  const {year} = useYear()
  const [filial] = useQueryState("filial");

  // Cashflow create dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"Приход" | "Расход">("Приход");
  const [selectedType, setSelectedType] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [cfDate, setCfDate] = useState("");
  const [cfComment, setCfComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debtId, setDebtId] = useState<string | undefined>(undefined);
  const [isKentSelected, setIsKentSelected] = useState(false);
  const [factoryId, setFactoryId] = useState<string | undefined>(undefined);
  const [isFactorySelected, setIsFactorySelected] = useState(false);
  const [logisticsId, setLogisticsId] = useState<string | undefined>(undefined);
  const [isLogisticsSelected, setIsLogisticsSelected] = useState(false);
  const [customsId, setCustomsId] = useState<string | undefined>(undefined);
  const [isCustomsSelected, setIsCustomsSelected] = useState(false);
  const [editCashflowId, setEditCashflowId] = useQueryState("editCashflowId", parseAsString);

  const { data: cfTypes } = useQuery({
    queryKey: ["/cashflow-types/by/managers", meUser?.id, dialogType],
    queryFn: () => getAllData<CashflowType[], object>("/cashflow-types/by/managers/" + (meUser?.id || "both"), {
      type: dialogType === "Приход" ? "in" : "out",
    }),
    enabled: dialogOpen && !!meUser?.id,
  });

  const { data: DeblsData } = useDeblsData({
    queries: { limit: 100, page: 1 },
    enabled: Boolean(isKentSelected),
  });
  const flatDeblsData = DeblsData?.pages?.flatMap((page) => page?.items || []) || [];

  const { data: factoriesData } = useQuery({
    queryKey: [apiRoutes.factoryReportEnabled],
    queryFn: () => getAllData<any[], undefined>(apiRoutes.factoryReportEnabled),
    enabled: Boolean(isFactorySelected),
  });

  const { data: logisticsData } = useQuery({
    queryKey: [apiRoutes.logistics, "logistics-select"],
    queryFn: () => getAllData<any, { limit: number }>(apiRoutes.logistics, { limit: 100 }),
    enabled: Boolean(isLogisticsSelected),
  });

  const { data: customsData } = useQuery({
    queryKey: [apiRoutes.customs, "customs-select"],
    queryFn: () => getAllData<any, { limit: number }>(apiRoutes.customs, { limit: 100 }),
    enabled: Boolean(isCustomsSelected),
  });

  const openCfDialog = (type: "Приход" | "Расход") => {
    setDialogType(type);
    setSelectedType("");
    setPrice(0);
    setCfDate("");
    setCfComment("");
    setDebtId(undefined);
    setIsKentSelected(false);
    setFactoryId(undefined);
    setIsFactorySelected(false);
    setLogisticsId(undefined);
    setIsLogisticsSelected(false);
    setCustomsId(undefined);
    setIsCustomsSelected(false);
    setDialogOpen(true);
  };

  const handleCfSubmit = async () => {
    if (!selectedType) { toast.error("Turni tanlang"); return; }
    if (!price || price <= 0) { toast.error("Summani kiriting"); return; }
    setIsSubmitting(true);
    try {
      await api.post(apiRoutes.cashflow, {
        cashflow_type: selectedType,
        type: dialogType,
        tip: "cashflow",
        comment: cfComment,
        price,
        ...(cfDate ? { date: cfDate } : {}),
        createdBy: meUser?.id,
        report: id,
        debtId: isKentSelected ? debtId : undefined,
        factoryId: isFactorySelected ? factoryId : undefined,
        logisticsId: isLogisticsSelected ? logisticsId : undefined,
        customsId: isCustomsSelected ? customsId : undefined,
      });
      toast.success(`${dialogType === "Приход" ? "Kirim" : "Chiqim"} muvaffaqiyatli qo'shildi`);
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
      queryClient.invalidateQueries({ queryKey: ["kassa-reports"] });
    } catch (e) {
      toast.error(String(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  const [tip] = useQueryState("tip", parseAsString);
  const [cashflowSlug, setCashflowSlug] = useQueryState("cashflowSlug", parseAsString);

  const [startDate, setStartDate] = useQueryState("startDate", parseAsIsoDate);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsIsoDate);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [typesManage, setTypesManage] = useQueryState("typesManage", parseAsString);

  const { data: KassaReport } = useKassaReportTotal({
    queries: {
      filialId: filial || undefined,
    },
    enabled: !id && !FManagerCashFlow && !myCashFlow ,
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDataCashflow({
      queries: {
        limit: 10,
        page: 1,
        year,
        filialId: filial || undefined,
        kassaId:
          id === "undefined" || !id || myCashFlow || FManagerCashFlow
            ? undefined
            : id,
        createdById:myCashFlow?  typesManage || undefined:  id === "undefined" ? meUser?.id : undefined,
        // @ts-ignore
        type: typeFilter[tip as string],
        // @ts-ignore
        tip: tipFilter[tip],
        search: search || undefined,
        cashflowSlug: tip == "collection" ? "cash_collection" : cashflowSlug|| undefined,
        fromDate: startDate || undefined,
        toDate: endDate || undefined,
        report: myCashFlow && !FManagerCashFlow ? id : undefined,
        kassa: FManagerCashFlow ? kassaId || undefined : undefined,
      },
      enabled: true,
    });

  const { data: KassaReportSingle } = useKassaReportSingle({
    id: kassaId || undefined,
    enabled: Boolean(kassaId),
  });

  const { data: myCashFlowReports } = useReportsSingle({
    id: id || undefined,
    enabled: Boolean(myCashFlow && id),
  });

  // O'z prixod/rasxodim (myCashFlow uchun)
  const { data: myTotals } = useCashflowForMainManager({
    id: myCashFlow ? id : undefined,
    enabled: Boolean(myCashFlow && id && meUser?.id),
    userId: meUser?.id,
  });


  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  // Biznes umumiy totallar (filtrlarga qarab o'zgaradi)
  const businessTotals = data?.pages?.[0]?.totals;
  const businessIncome = (businessTotals?.totalSum || 0) - (businessTotals?.totalExpense || 0);
  const businessExpense = businessTotals?.totalExpense || 0;

  // myCashFlow toolbar state
  const [showSearch, setShowSearch] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const hasActiveFilter = !!search || !!cashflowSlug || !!startDate || !!endDate || !!typesManage;

  // Cashflow types for filter sheet
  const { data: cfTypesFilter } = useQuery({
    queryKey: ["/cashflow-types/by/managers", "filter-sheet", typesManage],
    queryFn: () => getAllData<CashflowType[], object>("/cashflow-types/by/managers/" + (typesManage || "both"), {}),
    enabled: myCashFlow,
  });
  const cfTypesFilterList = (cfTypesFilter as CashflowType[])?.filter((ct) => ct.slug !== "balance") || [];

  // Managers/accountants for filter
  const { data: managersAccountants } = useQuery({
    queryKey: ["/user/managers-accountants"],
    queryFn: () => getAllData<{ items: { id: string; firstName: string }[] }, object>("/user/managers-accountants"),
    select: (res) => res?.items?.map((item) => ({ value: item?.id, label: item?.firstName })),
    enabled: myCashFlow,
  });

  // Excel export
  const { mutate: exportExcel, isPending: excelPending } = useMutation({
    mutationFn: async () => {
      const query: Record<string, string | undefined> = {
        reportId: myCashFlow && !FManagerCashFlow ? id : undefined,
        kassaId: FManagerCashFlow ? (kassaId || undefined) : (myCashFlow ? undefined : id || undefined),
      };
      if (search) query.search = search;
      if (cashflowSlug) query.cashflowSlug = cashflowSlug;
      if (startDate) query.fromDate = String(startDate);
      if (endDate) query.toDate = String(endDate);
      const params = `?${qs.stringify(query, { arrayFormat: "repeat" })}`;
      const url = import.meta.env.VITE_BASE_URL + apiRoutes.excelCashflowsExcel + params;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Export xatolik: ${response.status}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "cashflows.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    },
  });

  const clearFilters = () => {
    setSearch(null);
    setCashflowSlug(null);
    setStartDate(null);
    setEndDate(null);
    setTypesManage(null);
    setFilterOpen(false);
  };


  return (
    <>
      {!myCashFlow && (
        <Filter month={KassaReportSingle?.month} filial={KassaReportSingle?.filial?.title} />
      )}
      <div className={myCashFlow ? "flex flex-col h-full" : ""}>
        {myCashFlow ? (
          <>
          {/* Toolbar: search, sort, filter, excel + kirim/chiqim buttons */}
          <div className="flex items-center gap-[4px] shrink-0 mb-[10px]">
            {/* Search */}
            {showSearch ? (
              <div className="flex items-center gap-[4px] bg-white rounded-sm px-[10px] h-[42px]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.7508 15.7508L12.4883 12.4883" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <Input
                  autoFocus
                  defaultValue={search || ""}
                  onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearch(e.target.value || null);
                  }, 500)}
                  className="bg-transparent border-none h-[32px] w-[200px] p-0 text-[14px] shadow-none"
                  placeholder="Qidirish..."
                />
                <X
                  className="w-[16px] h-[16px] cursor-pointer text-[#A3A3A3] hover:text-[#1A1A1A]"
                  onClick={() => { setSearch(null); setShowSearch(false); }}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.7508 15.7508L12.4883 12.4883" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {/* Sort */}
            <button className="w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask_sort_rp" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="1" y="3" width="16" height="12">
                  <path d="M2.25 6.75L5.25 3.75M5.25 3.75L8.25 6.75M5.25 3.75V14.25M15.75 11.25L12.75 14.25M12.75 14.25L9.75 11.25M12.75 14.25V3.75" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </mask>
                <g mask="url(#mask_sort_rp)">
                  <rect x="9" y="1" width="10" height="16" fill="#0078D4"/>
                  <rect x="-1" y="1" width="10" height="16" fill="#1A1A1A"/>
                </g>
              </svg>
            </button>

            {/* Filter — popup, icon yonidan chiqadi */}
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <button
                  className="relative w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15.75 3H2.25M9.75 12H5.25M8.25 15H11.25M4.5 6H15M3 9H12"
                      stroke="#1A1A1A"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {hasActiveFilter && (
                    <span className="absolute top-[8px] right-[8px] w-[6px] h-[6px] rounded-full bg-[#0078D4]" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[330px] p-[12px] bg-[#f5f7f9] border border-[#e7ebf0] rounded-[12px] shadow-[0px_12px_24px_0px_rgba(12,36,58,0.08)] z-[40]"
              >
                <p className="text-[15px] font-medium text-[#1a1a1a] px-[4px] mb-[10px]">
                  Filter
                </p>
                <div className="flex flex-col gap-[10px]">
                  <div>
                    <p className="text-[12px] text-[#A3A3A3] mb-[4px] px-[4px]">Xodim</p>
                    <div className="bg-white rounded-[8px]">
                      <FilterSelect
                        name="typesManage"
                        placeholder="Xodim tanlang"
                        className="w-full"
                        classNameContainer="z-[60]"
                        options={
                          managersAccountants
                            ? [{ value: "clear", label: "Barchasi" }, ...managersAccountants]
                            : []
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#A3A3A3] mb-[4px] px-[4px]">Turi</p>
                    <div className="bg-white rounded-[8px]">
                      <FilterSelect
                        name="cashflowSlug"
                        placeholder="Turni tanlang"
                        className="w-full"
                        classNameContainer="z-[60]"
                        options={[
                          { label: "Barchasi", value: "clear" },
                          ...cfTypesFilterList.map((ct) => ({ label: ct.title, value: ct.slug })),
                        ]}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#A3A3A3] mb-[4px] px-[4px]">Sana oralig'i</p>
                    <div className="bg-white rounded-[8px]">
                      <DateRangePicker fromPlaceholder="Dan" toPlaceholder="Gacha" className="max-w-full" />
                    </div>
                  </div>
                  {hasActiveFilter && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full mt-[4px] h-[38px] rounded-[8px]"
                    >
                      Tozalash
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Excel */}
            <button
              onClick={() => exportExcel()}
              disabled={excelPending}
              className="w-[42px] h-[42px] rounded-sm bg-white flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {excelPending ? (
                <Loader className="w-[18px] h-[18px] animate-spin text-[#1A1A1A]" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip_excel_rp)">
                    <path d="M10.3725 0.0113551L0.2925 1.92386C0.122344 1.9562 0 2.11089 0 2.28385V15.7164C0 15.8893 0.122344 16.044 0.2925 16.0764L10.3725 17.9889C10.395 17.9931 10.4175 18.0001 10.44 18.0001C10.523 18.0001 10.6003 17.9748 10.665 17.9214C10.748 17.8524 10.8 17.747 10.8 17.6401V0.360105C10.8 0.25323 10.748 0.147761 10.665 0.0788551C10.582 0.00994889 10.478 -0.00833238 10.3725 0.0113551ZM11.52 2.1601V4.6801H12.24V5.4001H11.52V7.2001H12.24V7.9201H11.52V9.7201H12.24V10.4401H11.52V12.6001H12.24V13.3201H11.52V15.8401H16.92C17.3166 15.8401 17.64 15.5167 17.64 15.1201V2.88011C17.64 2.48354 17.3166 2.1601 16.92 2.1601H11.52ZM12.96 4.6801H15.84V5.4001H12.96V4.6801ZM2.4075 5.6476H4.2525L5.22 7.66135C5.29594 7.82026 5.36344 8.01573 5.4225 8.2351H5.43375C5.47172 8.10432 5.54484 7.89901 5.6475 7.63885L6.71625 5.6476H8.40375L6.39 8.9776L8.46 12.3751H6.67125L5.50125 10.1814C5.45766 10.0998 5.41266 9.94932 5.36625 9.73135H5.355C5.3325 9.83401 5.27906 9.99432 5.1975 10.2039L4.0275 12.3751H2.2275L4.37625 9.01135L2.4075 5.6476ZM12.96 7.2001H15.84V7.9201H12.96V7.2001ZM12.96 9.7201H15.84V10.4401H12.96V9.7201ZM12.96 12.6001H15.84V13.3201H12.96V12.6001Z" fill="#1A1A1A"/>
                  </g>
                  <defs><clipPath id="clip_excel_rp"><rect width="18" height="18" fill="white"/></clipPath></defs>
                </svg>
              )}
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Kirim / Chiqim buttons — Boss uchun hide */}
            {meUser?.position?.role != 12 && (
              <>
                <Button onClick={() => openCfDialog("Приход")} className="bg-[#47B13C] hover:bg-[#3da032] text-white px-5 h-[42px] rounded-sm text-[14px]">
                  <Plus size={16} className="mr-1" /> Kirim qo'shish
                </Button>
                <Button onClick={() => openCfDialog("Расход")} className="bg-[#E38157] hover:bg-[#D27047] text-white px-5 h-[42px] rounded-sm text-[14px]">
                  <Plus size={16} className="mr-1" /> Chiqim qo'shish
                </Button>
              </>
            )}
          </div>

          <div className="flex gap-[4px] mb-[12px]">
            {/* Yashil card */}
            <div className="bg-[#47B13C] text-white rounded-sm p-5 min-w-[260px] h-[150px] w-[30%] shrink-0 flex flex-col justify-between relative overflow-hidden">
              <p className="text-[28px] font-medium">
                ${(meUser?.position?.role == 9
                  ? myCashFlowReports?.managerSum || 0
                  : myCashFlowReports?.accountantSum || myCashFlowReports?.accauntantSum || 0
                ).toLocaleString("uz-UZ", { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-[16px] text-[15px]">
                <div className="flex items-center gap-1">
                  <ArrowDown className="w-4 h-4" />
                  <span>${(myTotals?.income || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowUp className="w-4 h-4" />
                  <span>${(myTotals?.expense || 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="text-[15px] opacity-50">
                Saldo balans — ${(meUser?.position?.role == 9
                  ? myCashFlowReports?.managerSaldo || 0
                  : myCashFlowReports?.accountantSaldo || 0
                ).toLocaleString()}
              </div>
              <svg className="absolute right-[10px] bottom-[20px] opacity-70" width="92" height="60" viewBox="0 0 61 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.3" d="M6.72032 23.7873L0.368164 30.6778V40H60.3677V2.64208L55.5589 5.65377C53.8525 6.72247 52.4565 8.22039 51.5105 9.99777C48.9524 14.804 43.3749 17.1583 38.1467 15.6386L35.4451 14.8534C34.0685 14.4533 32.9121 13.5137 32.2385 12.2482C29.9493 7.94705 23.5607 8.73988 22.3922 13.4702L20.8222 19.8261C19.9904 23.1934 16.1106 24.7635 13.1711 22.9226C11.0929 21.621 8.38237 21.9844 6.72032 23.7873Z" fill="url(#paint0_linear_mycf)"/>
                <path d="M0.368164 30.7143L6.72067 23.8152C8.38208 22.0108 11.0937 21.6472 13.1717 22.9502C16.1099 24.7925 19.99 23.2228 20.8207 19.8558L22.3924 13.4853C23.5599 8.7532 29.9515 7.96069 32.2393 12.2643C32.9124 13.5303 34.0686 14.4705 35.4452 14.8711L38.1372 15.6545C43.37 17.1772 48.9533 14.8199 51.5115 10.0078C52.4568 8.22951 53.8524 6.73052 55.5586 5.66065L60.3677 2.64522" stroke="white"/>
                <defs>
                  <linearGradient id="paint0_linear_mycf" x1="30.3679" y1="0" x2="30.3679" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Biznesga umumiy kirim */}
            <div className="flex-1 bg-white rounded-sm p-5 h-[150px] flex flex-col justify-between">
              <div className="flex items-center gap-[10px]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <div>
                  <p className="text-[15px] font-medium text-[#1a1a1a]">Biznesga umumiy kirim</p>
                  <p className="text-[12px] text-[#a3a3a3]">Hisobchi va Boshqaruvchi</p>
                </div>
              </div>
              <p className="text-[28px] font-medium text-[#47B13C]">
                ${businessIncome.toLocaleString("uz-UZ", { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Biznesdan umumiy chiqim */}
            <div className="flex-1 bg-white rounded-sm p-5 h-[150px] flex flex-col justify-between">
              <div className="flex items-center gap-[10px]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <div>
                  <p className="text-[15px] font-medium text-[#1a1a1a]">Biznesdan umumiy chiqim</p>
                  <p className="text-[12px] text-[#a3a3a3]">Hisobchi va Boshqaruvchi</p>
                </div>
              </div>
              <p className="text-[28px] font-medium text-[#E38157]">
                ${businessExpense.toLocaleString("uz-UZ", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Cashflow create dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[640px] costomModal rounded-sm px-4 pb-4">
              <div className={`p-3 h-[44px] font-bold pb-0 text-center mx-auto rounded-t-sm w-1/2 -mt-[45px] ${dialogType === "Приход" ? "bg-[#89A143]" : "bg-[#E38157]"} text-white`}>
                {dialogType === "Приход" ? "Kirim qo'shish" : "Chiqim qo'shish"}
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className={`w-full grid ${cfTypes && cfTypes.length < 6 ? "grid-cols-2" : "grid-cols-3"} gap-0.5`}>
                  {cfTypes?.filter((i) => i?.is_visible && !["balance", "dealer", "kassa", "online"].includes(i?.slug))?.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedType(item.id);
                        if (item?.slug === "kent") {
                          setIsKentSelected(true);
                          setIsFactorySelected(false);
                        } else if (item?.title === "Поставщики") {
                          setIsFactorySelected(true);
                          setIsKentSelected(false);
                          setIsLogisticsSelected(false);
                          setDebtId(undefined);
                        } else if (item?.slug === "logistics") {
                          setIsLogisticsSelected(true);
                          setIsKentSelected(false);
                          setIsFactorySelected(false);
                          setIsCustomsSelected(false);
                          setDebtId(undefined);
                          setFactoryId(undefined);
                          setCustomsId(undefined);
                        } else if (item?.slug === "customs") {
                          setIsCustomsSelected(true);
                          setIsKentSelected(false);
                          setIsFactorySelected(false);
                          setIsLogisticsSelected(false);
                          setDebtId(undefined);
                          setFactoryId(undefined);
                          setLogisticsId(undefined);
                        } else {
                          setIsKentSelected(false);
                          setIsFactorySelected(false);
                          setIsLogisticsSelected(false);
                          setIsCustomsSelected(false);
                          setDebtId(undefined);
                          setFactoryId(undefined);
                          setLogisticsId(undefined);
                          setCustomsId(undefined);
                        }
                      }}
                      className={`${selectedType === item.id ? "bg-[#5D5D53] text-[white]" : "bg-input text-primary"} flex items-center justify-center flex-col pt-4 rounded-sm text-center cursor-pointer`}
                    >
                      <img
                        src={minio_img_url + (typeof item.icon === 'object' ? (item.icon as any)?.path : item.icon)}
                        style={{ filter: selectedType === item.id ? "invert(1) brightness(2)" : "" }}
                      />
                      <p className="text-[13px] font-medium my-2.5">{item.title}</p>
                    </div>
                  ))}
                </div>
                <div className="w-full">
                  {isKentSelected && (
                    <ShadcnSelect
                      value={debtId}
                      options={
                        flatDeblsData.map((item) => ({
                          value: item.id,
                          label: item.fullName,
                        })) || []
                      }
                      placeholder={"Кенты"}
                      onChange={(value) => {
                        setDebtId(value);
                      }}
                      className="w-full text-[#5D5D53] border-none h-[90px] !bg-input !text-[22px] font-semibold rounded-sm px-[17px] py-[26px]"
                    />
                  )}
                  {isFactorySelected && (
                    <ShadcnSelect
                      value={factoryId}
                      options={
                        (factoriesData as any[])?.map((item: any) => ({
                          value: item.id,
                          label: item.title,
                        })) || []
                      }
                      placeholder={"Заводы"}
                      onChange={(value) => {
                        setFactoryId(value);
                      }}
                      className="w-full text-[#5D5D53] border-none h-[90px] !bg-input !text-[22px] font-semibold rounded-sm px-[17px] py-[26px]"
                    />
                  )}
                  {isLogisticsSelected && (
                    <ShadcnSelect
                      value={logisticsId}
                      options={
                        ((logisticsData as any)?.items || [])?.map((item: any) => ({
                          value: item.id,
                          label: item.title,
                        })) || []
                      }
                      placeholder={"Логистика"}
                      onChange={(value) => {
                        setLogisticsId(value);
                      }}
                      className="w-full text-[#5D5D53] border-none h-[90px] !bg-input !text-[22px] font-semibold rounded-sm px-[17px] py-[26px]"
                    />
                  )}
                  {isCustomsSelected && (
                    <ShadcnSelect
                      value={customsId}
                      options={
                        ((customsData as any)?.items || [])?.map((item: any) => ({
                          value: item.id,
                          label: item.title,
                        })) || []
                      }
                      placeholder={"Таможня"}
                      onChange={(value) => {
                        setCustomsId(value);
                      }}
                      className="w-full text-[#5D5D53] border-none h-[90px] !bg-input !text-[22px] font-semibold rounded-sm px-[17px] py-[26px]"
                    />
                  )}
                  <Input
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    type="number"
                    placeholder="0.00"
                    className="w-full border-none h-[90px] placeholder:text-[32px] mt-0.5 !text-[32px] font-semibold rounded-sm px-[17px] py-[26px]"
                  />
                  <Input
                    value={cfDate}
                    onChange={(e) => setCfDate(e.target.value)}
                    type="datetime-local"
                    className="w-full border-none h-[45px] mt-0.5 text-[14px] font-semibold rounded-sm px-[17px] py-[10px]"
                  />
                  <Textarea
                    value={cfComment}
                    onChange={(e) => setCfComment(e.target.value)}
                    placeholder="Izoh"
                    className="w-full border-none focus:border-none outline-none mt-0.5 h-[90px] text-[13px] bg-input font-semibold rounded-sm px-2 py-2.5"
                  />
                </div>
              </div>
              <Button
                onClick={handleCfSubmit}
                disabled={isSubmitting}
                className={`p-5 py-6 rounded-sm ${dialogType === "Приход" ? "bg-[#89A143]" : "bg-[#E38157]"} text-white`}
              >
                {isSubmitting ? <Spinner className="h-4 w-4 mr-2" /> : null}
                {isSubmitting ? "Qo'shilmoqda..." : `${dialogType === "Приход" ? "Kirimga" : "Chiqimga"} qo'shish`}
              </Button>
            </DialogContent>
          </Dialog>

          {/* Labellar */}
          <div
            className="mb-[10px] shrink-0 px-[12px]"
            style={{ display: "grid", gridTemplateColumns: myCashflowGridTemplate, gap: "16px" }}
          >
            {myCashflowLabels.map((label: any, i: any) => (
              <span key={i} className={`text-[13px] text-[#A3A3A3] ${label.center ? "text-center" : ""} ${(label as any).right ? "text-right" : ""}`}>{label.text}</span>
            ))}
          </div>

          {/* Cashflow listlar */}
          <div className="flex-1 min-h-0 overflow-auto scrollCastom flex flex-col gap-[4px]">
            {isLoading && flatData.length === 0 ? (
              <div className="flex items-center justify-center py-[40px]">
                <Loader className="w-[24px] h-[24px] animate-spin text-[#A3A3A3]" />
              </div>
            ) : flatData.length === 0 ? (
              <div className="flex items-center justify-center py-[40px]">
                <span className="text-[13px] text-[#A3A3A3]">Ma'lumot topilmadi</span>
              </div>
            ) : (
              flatData.map((item: any, i: number) => (
                <MyCashflowRow
                  key={item?.id || i}
                  item={item}
                  onEdit={(cf: any) => setEditCashflowId(String(cf.id))}
                  onDelete={(cf: any) => {
                    api.delete(apiRoutes.cashflow + "/" + cf.id).then(() => {
                      toast.success("O'chirildi");
                      queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
                      queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
                    });
                  }}
                />
              ))
            )}
          </div>
          </>
        ) : (
          <>
          <CardSort
          isUserSelectble
            isOnlineCashFlow={meUser?.position.role == 10}
            isOnlyCash={false}
            isOnlyTerminal={false}
            isAddible
            kassaId={FManagerCashFlow ? kassaId : undefined}
            reportId={undefined}
            KassaReport={
             ( id === "undefined" || FManagerCashFlow)
                ? KassaReportSingle
                :  !id ?  KassaReport : undefined
            }
            KassaId={(id === "undefined" || !id) ? undefined : id}
          />
          <DataTable
            columns={Columns}
            data={flatData || []}
            isLoading={isLoading}
            className="h-[calc(100vh-310px)] scrollCastom"
            isRowClickble={false}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
          />
          </>
        )}
      </div>

      <UpdateCashflowDialog
        editId={editCashflowId}
        onClose={() => setEditCashflowId(null)}
        item={flatData.find((i) => String(i.id) === editCashflowId)}
      />
    </>
  );
}
