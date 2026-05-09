import { DataTable } from "@/components/ui/data-table";
import { useEffect, useRef, useState } from "react";
import { Plus, ArrowDown, ArrowUp, Loader } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import qs from "qs";

import Filter from "./filter";
import CardSort from "@/components/card-sort";
import ReportToolbar from "@/components/report-toolbar";
import FilterSelect from "@/components/filters-ui/filter-select";
import { DateRangePicker } from "@/components/filters-ui/date-picker-range";
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
    income: "income",
    expense: "expense",
    sale: "income",
    return: "expense",
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
  const [dialogType, setDialogType] = useState<"income" | "expense">("income");
  const [selectedType, setSelectedType] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [cfDate, setCfDate] = useState("");
  const [cfComment, setCfComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [streetId, setStreetId] = useState<string | undefined>(undefined);
  const [isStreetSelected, setIsStreetSelected] = useState(false);
  const [streetPercent, setStreetPercent] = useState<number>(0);
  const [factoryId, setFactoryId] = useState<string | undefined>(undefined);
  const [isFactorySelected, setIsFactorySelected] = useState(false);
  const [logisticsId, setLogisticsId] = useState<string | undefined>(undefined);
  const [isLogisticsSelected, setIsLogisticsSelected] = useState(false);
  const [customsId, setCustomsId] = useState<string | undefined>(undefined);
  const [isCustomsSelected, setIsCustomsSelected] = useState(false);
  const [shareId, setShareId] = useState<string | undefined>(undefined);
  const [isShareSelected, setIsShareSelected] = useState(false);
  const [shareKind, setShareKind] = useState<"capital" | "profit">("capital");
  const [editCashflowId, setEditCashflowId] = useQueryState("editCashflowId", parseAsString);

  const { data: cfTypes } = useQuery({
    queryKey: ["/cashflow-types/by/managers", meUser?.id, dialogType],
    queryFn: () => getAllData<CashflowType[], object>("/cashflow-types/by/managers/" + (meUser?.id || "both"), {
      type: dialogType === "income" ? "in" : "out",
    }),
    enabled: dialogOpen && !!meUser?.id,
  });

  const { data: DeblsData } = useDeblsData({
    queries: { limit: 100, page: 1 },
    enabled: Boolean(isStreetSelected),
  });
  const flatStreetsData = DeblsData?.pages?.flatMap((page) => page?.items || []) || [];

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

  const { data: sharesData } = useQuery({
    queryKey: [apiRoutes.share, "share-select"],
    queryFn: () => getAllData<any, { limit: number }>(apiRoutes.share, { limit: 200 }),
    enabled: Boolean(isShareSelected),
  });

  const openCfDialog = (type: "income" | "expense") => {
    setDialogType(type);
    setSelectedType("");
    setPrice(0);
    setCfDate("");
    setCfComment("");
    setStreetId(undefined);
    setIsStreetSelected(false);
    setStreetPercent(0);
    setFactoryId(undefined);
    setIsFactorySelected(false);
    setLogisticsId(undefined);
    setIsLogisticsSelected(false);
    setCustomsId(undefined);
    setIsCustomsSelected(false);
    setShareId(undefined);
    setIsShareSelected(false);
    setShareKind("capital");
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
        streetId: isStreetSelected ? streetId : undefined,
        streetPercent: isStreetSelected && dialogType === "income" ? streetPercent : undefined,
        factoryId: isFactorySelected ? factoryId : undefined,
        logisticsId: isLogisticsSelected ? logisticsId : undefined,
        customsId: isCustomsSelected ? customsId : undefined,
        shareId: isShareSelected ? shareId : undefined,
        // Yangi logika: income ham, expense ham Kapital/Foyda toggle bilan
        shareKind: isShareSelected ? shareKind : undefined,
      });
      toast.success(`${dialogType === "income" ? "Kirim" : "Chiqim"} muvaffaqiyatli qo'shildi`);
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
        cashflowSlug: tip == "collection" ? "cashCollection" : cashflowSlug|| undefined,
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
    enabled: Boolean(id),
  });

  // Yopilgan reportda M-Manager (role=9) yoki Accountant (role=10) qo'shish/tahrirlash imkoniyatini hide qilamiz
  const role = meUser?.position?.role;
  const isReportLockedForUser =
    (role === 9 && Boolean((myCashFlowReports as any)?.isMManagerConfirmed)) ||
    (role === 10 && Boolean((myCashFlowReports as any)?.isAccountantConfirmed)) ||
    (myCashFlowReports as any)?.status === "accepted";

  // O'z prixod/rasxodim (myCashFlow uchun)
  const { data: myTotals } = useCashflowForMainManager({
    id: myCashFlow ? id : undefined,
    enabled: Boolean(myCashFlow && id && meUser?.id),
    userId: meUser?.id,
  });


  const flatData = data?.pages?.flatMap((page) => page?.items || []) || [];

  // Infinite scroll sentinel — myCashFlow list pagination
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!myCashFlow) return;
    const node = loadMoreRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [myCashFlow, hasNextPage, isFetchingNextPage, fetchNextPage, flatData.length]);

  // Biznes umumiy totallar (filtrlarga qarab o'zgaradi)
  // totalIncome backend tomonida logistics income'ni allaqachon chiqarib tashlagan,
  // shuning uchun totalSum-totalExpense'dan ko'ra to'g'ridan-to'g'ri ishlatamiz.
  const businessTotals = data?.pages?.[0]?.totals;
  const businessIncome = businessTotals?.totalIncome || 0;
  const businessExpense = businessTotals?.totalExpense || 0;

  const hasActiveFilter = !!search || !!cashflowSlug || !!startDate || !!endDate || !!typesManage;

  // Cashflow types for filter sheet
  const { data: cfTypesFilter } = useQuery({
    queryKey: ["/cashflow-types/by/managers", "filter-sheet", typesManage],
    queryFn: () => getAllData<CashflowType[], object>("/cashflow-types/by/managers/" + (typesManage || "both"), {}),
    enabled: myCashFlow,
  });
  const cfTypesFilterList = (cfTypesFilter as CashflowType[]) || [];

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
  };


  return (
    <>
      {!myCashFlow && (
        <Filter month={KassaReportSingle?.month} filial={KassaReportSingle?.filial?.title} />
      )}
      <div className={myCashFlow ? "flex flex-col h-full" : ""}>
        {myCashFlow ? (
          <>
          {/* Toolbar — reusable component */}
          <div className="shrink-0">
            <ReportToolbar
              hasActiveFilter={hasActiveFilter}
              onClearFilters={clearFilters}
              onExport={() => exportExcel()}
              excelPending={excelPending}
              filterContent={
                <>
                  <div className="flex flex-col gap-[6px]">
                    <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Xodim</p>
                    <FilterSelect
                      variant="filter"
                      name="typesManage"
                      placeholder="Xodim tanlang"
                      classNameContainer="z-[60]"
                      options={
                        managersAccountants
                          ? [{ value: "clear", label: "Barchasi" }, ...managersAccountants]
                          : []
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Turi</p>
                    <FilterSelect
                      variant="filter"
                      name="cashflowSlug"
                      placeholder="Turni tanlang"
                      classNameContainer="z-[60]"
                      options={[
                        { label: "Barchasi", value: "clear" },
                        ...cfTypesFilterList.map((ct) => ({ label: ct.title, value: ct.slug })),
                      ]}
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-[6px]">
                    <p className="text-[13px] text-[#1a1a1a] pl-[10px]">Sana oralig'i</p>
                    <DateRangePicker variant="filter" fromPlaceholder="...dan" toPlaceholder="...gacha" />
                  </div>
                </>
              }
              actions={
                meUser?.position?.role != 12 && !isReportLockedForUser ? (
                  <>
                    <Button
                      onClick={() => openCfDialog("income")}
                      className="bg-[#47B13C] hover:bg-[#3da032] text-white px-5 h-[42px] rounded-sm text-[14px]"
                    >
                      <Plus size={16} className="mr-1" /> Kirim qo'shish
                    </Button>
                    <Button
                      onClick={() => openCfDialog("expense")}
                      className="bg-[#E38157] hover:bg-[#D27047] text-white px-5 h-[42px] rounded-sm text-[14px]"
                    >
                      <Plus size={16} className="mr-1" /> Chiqim qo'shish
                    </Button>
                  </>
                ) : isReportLockedForUser ? (
                  <span className="text-[13px] font-medium text-[#A3A3A3] bg-[#F5F5F5] rounded-[6px] px-[12px] h-[42px] flex items-center">
                    Report yopilgan — tahrirlash mumkin emas
                  </span>
                ) : undefined
              }
            />
          </div>

          <div className="flex gap-[4px] mb-[12px]">
            {/* Yashil card */}
            <div className="bg-[#47B13C] text-white rounded-sm p-5 min-w-[260px] h-[150px] w-[30%] shrink-0 flex flex-col justify-between relative overflow-hidden">
              <p className="text-[28px] font-medium">
                ${(meUser?.position?.role == 9
                  ? myCashFlowReports?.managerSum || 0
                  : myCashFlowReports?.accountantSum || myCashFlowReports?.accountantSum || 0
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
              <div className={`p-3 h-[44px] font-bold pb-0 text-center mx-auto rounded-t-sm w-1/2 -mt-[45px] ${dialogType === "income" ? "bg-[#89A143]" : "bg-[#E38157]"} text-white`}>
                {dialogType === "income" ? "Kirim qo'shish" : "Chiqim qo'shish"}
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className={`w-full grid ${cfTypes && cfTypes.length < 6 ? "grid-cols-2" : "grid-cols-3"} gap-0.5`}>
                  {cfTypes?.filter((i) => i?.is_visible && !["balance", "dealer", "kassa", "online"].includes(i?.slug))?.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedType(item.id);
                        if (item?.slug === "street") {
                          setIsStreetSelected(true);
                          setIsFactorySelected(false);
                        } else if (item?.slug === "factory") {
                          setIsFactorySelected(true);
                          setIsStreetSelected(false);
                          setIsLogisticsSelected(false);
                          setIsCustomsSelected(false);
                          setStreetId(undefined);
                          setLogisticsId(undefined);
                          setCustomsId(undefined);
                        } else if (item?.slug === "logistics") {
                          setIsLogisticsSelected(true);
                          setIsStreetSelected(false);
                          setIsFactorySelected(false);
                          setIsCustomsSelected(false);
                          setStreetId(undefined);
                          setFactoryId(undefined);
                          setCustomsId(undefined);
                        } else if (item?.slug === "customs") {
                          setIsCustomsSelected(true);
                          setIsStreetSelected(false);
                          setIsFactorySelected(false);
                          setIsLogisticsSelected(false);
                          setIsShareSelected(false);
                          setStreetId(undefined);
                          setFactoryId(undefined);
                          setLogisticsId(undefined);
                          setShareId(undefined);
                        } else if (item?.slug === "share") {
                          setIsShareSelected(true);
                          setIsStreetSelected(false);
                          setIsFactorySelected(false);
                          setIsLogisticsSelected(false);
                          setIsCustomsSelected(false);
                          setStreetId(undefined);
                          setFactoryId(undefined);
                          setLogisticsId(undefined);
                          setCustomsId(undefined);
                          setShareKind("capital");
                        } else {
                          setIsStreetSelected(false);
                          setIsFactorySelected(false);
                          setIsLogisticsSelected(false);
                          setIsCustomsSelected(false);
                          setIsShareSelected(false);
                          setStreetId(undefined);
                          setFactoryId(undefined);
                          setLogisticsId(undefined);
                          setCustomsId(undefined);
                          setShareId(undefined);
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
                  {isStreetSelected && (
                    <div className="flex flex-col gap-1">
                      <ShadcnSelect
                        value={streetId}
                        options={
                          flatStreetsData.map((item) => ({
                            value: item.id,
                            label: item.fullName,
                          })) || []
                        }
                        placeholder={"Qarz beruvchi"}
                        onChange={(value) => {
                          setStreetId(value);
                        }}
                        className="w-full text-[#5D5D53] border-none h-[90px] !bg-input !text-[22px] font-semibold rounded-sm px-[17px] py-[26px]"
                      />
                      {dialogType === "income" && (
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="Foiz summa ($)"
                          value={streetPercent || ""}
                          onChange={(e) => setStreetPercent(Number(e.target.value))}
                          className="w-full !text-[16px] h-[44px] rounded-sm bg-input border-none px-3"
                        />
                      )}
                    </div>
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
                      placeholder={"Zavod tanlang"}
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
                  {isShareSelected && (
                    <div className="flex flex-col gap-1">
                      <ShadcnSelect
                        value={shareId}
                        options={
                          ((sharesData as any)?.items || [])?.map((item: any) => ({
                            value: item.id,
                            label: item.fullName || "—",
                          })) || []
                        }
                        placeholder={"Sherikni tanlang"}
                        onChange={(value) => {
                          setShareId(value);
                        }}
                        className="w-full text-[#5D5D53] border-none h-[90px] !bg-input !text-[22px] font-semibold rounded-sm px-[17px] py-[26px]"
                      />
                      <div className="flex w-full bg-input rounded-sm p-0.5 mt-1 cursor-pointer relative">
                        <div
                          className={`${shareKind === "capital" ? "left-0.5" : "left-[50%]"} transition-all duration-300 ease-in-out absolute rounded-sm top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-primary`}
                        />
                        <p
                          onClick={() => setShareKind("capital")}
                          className={`flex-1 text-center py-2 z-10 text-[14px] font-medium ${
                            shareKind === "capital" ? "text-input" : "text-primary"
                          }`}
                        >
                          Tan
                        </p>
                        <p
                          onClick={() => setShareKind("profit")}
                          className={`flex-1 text-center py-2 z-10 text-[14px] font-medium ${
                            shareKind === "profit" ? "text-input" : "text-primary"
                          }`}
                        >
                          Foyda
                        </p>
                      </div>
                    </div>
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
                className={`p-5 py-6 rounded-sm ${dialogType === "income" ? "bg-[#89A143]" : "bg-[#E38157]"} text-white`}
              >
                {isSubmitting ? <Spinner className="h-4 w-4 mr-2" /> : null}
                {isSubmitting ? "Qo'shilmoqda..." : `${dialogType === "income" ? "Kirimga" : "Chiqimga"} qo'shish`}
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
              <>
                {flatData.map((item: any, i: number) => (
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
                ))}
                {hasNextPage && (
                  <div ref={loadMoreRef} className="flex items-center justify-center py-[16px]">
                    {isFetchingNextPage && (
                      <Loader className="w-[20px] h-[20px] animate-spin text-[#A3A3A3]" />
                    )}
                  </div>
                )}
              </>
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
