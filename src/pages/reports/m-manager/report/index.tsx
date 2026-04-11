import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import Filter from "./filter";
import CardSort from "@/components/card-sort";
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

export default function ReportPage() {
  const tipFilter = {
    income: "cashflow",
    expense: "cashflow",
    sale: "order",
    return: "order",
    terminal:"Терминал",
    discount:"Скидка",
    navar:"Навар",
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
  const [cashflowSlug] = useQueryState("cashflowSlug", parseAsString);

  const [startDate] = useQueryState("startDate", parseAsIsoDate);
  const [endDate] = useQueryState("endDate", parseAsIsoDate);
  const [search] = useQueryState("search", parseAsString);
  const [typesManage] = useQueryState("typesManage", parseAsString);

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
        cashflowSlug: tip == "collection" ? "Инкассация" : cashflowSlug|| undefined,
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

  return (
    <>
      <Filter month={myCashFlow?myCashFlowReports?.month: KassaReportSingle?.month} filial={KassaReportSingle?.filial?.title} />
      < >
        {myCashFlow ? (
          <>
          {/* Kirim / Chiqim buttons */}
          <div className="flex gap-2 mb-3 justify-end">
            <Button onClick={() => openCfDialog("Приход")} className="bg-[#89A143] hover:bg-[#799132] text-white px-5 py-3 rounded-xl text-[14px]">
              <Plus size={16} className="mr-1" /> Kirim qo'shish
            </Button>
            <Button onClick={() => openCfDialog("Расход")} className="bg-[#E38157] hover:bg-[#D27047] text-white px-5 py-3 rounded-xl text-[14px]">
              <Plus size={16} className="mr-1" /> Chiqim qo'shish
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {/* Oq card — o'zimga tegishli */}
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-muted-foreground mb-1">Mening balansim</p>
              <p className="text-2xl font-bold">
                {(meUser?.position?.role == 9
                  ? myCashFlowReports?.managerSum || 0
                  : myCashFlowReports?.accountantSum || myCashFlowReports?.accauntantSum || 0
                ).toFixed(2)}$
              </p>
              <div className="flex gap-4 mt-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Prixod</p>
                  <p className="text-sm font-semibold text-[#89A143]">+{(myTotals?.income || 0).toFixed(2)}$</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Rasxod</p>
                  <p className="text-sm font-semibold text-[#E38157]">-{(myTotals?.expense || 0).toFixed(2)}$</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 mb-1">Saldo balans</p>
              <p className="text-sm font-semibold text-[#89A143]">
                {(meUser?.position?.role == 9
                  ? myCashFlowReports?.managerSaldo || 0
                  : myCashFlowReports?.accountantSaldo || 0
                ).toFixed(2)}$
              </p>
            </div>
            {/* Yashil card — biznes umumiy kirim */}
            <div className="bg-[#89A143] rounded-xl p-5 text-white">
              <p className="text-xs opacity-80 mb-1">Biznes kirim</p>
              <p className="text-2xl font-bold">
                +{businessIncome.toFixed(2)}$
              </p>
            </div>
            {/* Qizil card — biznes umumiy chiqim */}
            <div className="bg-[#E38157] rounded-xl p-5 text-white">
              <p className="text-xs opacity-80 mb-1">Biznes chiqim</p>
              <p className="text-2xl font-bold">
                -{businessExpense.toFixed(2)}$
              </p>
            </div>
          </div>

          {/* Cashflow create dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[640px] costomModal rounded-[12px] px-4 pb-4">
              <div className={`p-3 h-[44px] font-bold pb-0 text-center mx-auto rounded-t-[7px] w-1/2 -mt-[45px] ${dialogType === "Приход" ? "bg-[#89A143]" : "bg-[#E38157]"} text-white`}>
                {dialogType === "Приход" ? "Kirim qo'shish" : "Chiqim qo'shish"}
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className={`w-full grid ${cfTypes && cfTypes.length < 6 ? "grid-cols-2" : "grid-cols-3"} gap-0.5`}>
                  {cfTypes?.filter((i) => i?.is_visible && !["Balance", "delaer", "kassa", "онлайн"].includes(i?.slug))?.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedType(item.id);
                        if (item?.slug === "dolg") {
                          setIsKentSelected(true);
                          setIsFactorySelected(false);
                        } else if (item?.title === "Поставщики") {
                          setIsFactorySelected(true);
                          setIsKentSelected(false);
                          setIsLogisticsSelected(false);
                          setDebtId(undefined);
                        } else if (item?.slug === "logistika" || item?.title === "Логистика") {
                          setIsLogisticsSelected(true);
                          setIsKentSelected(false);
                          setIsFactorySelected(false);
                          setDebtId(undefined);
                          setFactoryId(undefined);
                        } else {
                          setIsKentSelected(false);
                          setIsFactorySelected(false);
                          setIsLogisticsSelected(false);
                          setDebtId(undefined);
                          setFactoryId(undefined);
                          setLogisticsId(undefined);
                        }
                      }}
                      className={`${selectedType === item.id ? "bg-[#5D5D53] text-[white]" : "bg-input text-primary"} flex items-center justify-center flex-col pt-4 rounded-[7px] text-center cursor-pointer`}
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
                      className="w-full text-[#5D5D53] border-none h-[90px] !bg-input !text-[22px] font-semibold rounded-[7px] px-[17px] py-[26px]"
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
                      className="w-full text-[#5D5D53] border-none h-[90px] !bg-input !text-[22px] font-semibold rounded-[7px] px-[17px] py-[26px]"
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
                      className="w-full text-[#5D5D53] border-none h-[90px] !bg-input !text-[22px] font-semibold rounded-[7px] px-[17px] py-[26px]"
                    />
                  )}
                  <Input
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    type="number"
                    placeholder="0.00"
                    className="w-full border-none h-[90px] placeholder:text-[32px] mt-0.5 !text-[32px] font-semibold rounded-[7px] px-[17px] py-[26px]"
                  />
                  <Input
                    value={cfDate}
                    onChange={(e) => setCfDate(e.target.value)}
                    type="datetime-local"
                    className="w-full border-none h-[45px] mt-0.5 text-[14px] font-semibold rounded-[7px] px-[17px] py-[10px]"
                  />
                  <Textarea
                    value={cfComment}
                    onChange={(e) => setCfComment(e.target.value)}
                    placeholder="Izoh"
                    className="w-full border-none focus:border-none outline-none mt-0.5 h-[90px] text-[13px] bg-input font-semibold rounded-[7px] px-2 py-2.5"
                  />
                </div>
              </div>
              <Button
                onClick={handleCfSubmit}
                disabled={isSubmitting}
                className={`p-5 py-6 rounded-[7px] ${dialogType === "Приход" ? "bg-[#89A143]" : "bg-[#E38157]"} text-white`}
              >
                {isSubmitting ? <Spinner className="h-4 w-4 mr-2" /> : null}
                {isSubmitting ? "Qo'shilmoqda..." : `${dialogType === "Приход" ? "Kirimga" : "Chiqimga"} qo'shish`}
              </Button>
            </DialogContent>
          </Dialog>
          </>
        ) : (
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
        )}
        <DataTable
          columns={Columns}
          data={flatData || []}
          isLoading={isLoading}
          className={`${myCashFlow ? "h-[calc(100vh-470px)]" : "h-[calc(100vh-310px)]"} scrollCastom`}
          isRowClickble={false}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />
      </>

      <UpdateCashflowDialog
        editId={editCashflowId}
        onClose={() => setEditCashflowId(null)}
        item={flatData.find((i) => String(i.id) === editCashflowId)}
      />
    </>
  );
}
