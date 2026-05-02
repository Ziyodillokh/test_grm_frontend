import { useQueryClient } from "@tanstack/react-query";
import { DollarSign, Plus } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// import ShadcnSelect from "@/components/Select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import {
  useDataCashflowTypes,
  useKassaById,
} from "@/pages/report/table/queries";

import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";
import { useMeStore } from "@/store/me-store";
import { TKassareportData } from "@/pages/report/type";
import { minio_img_url } from "@/constants";
import useDataFetch from "@/pages/filial/table/queries";
import ShadcnSelect from "./Select";
import useDeblsData from "@/pages/debt/table/queries";
import { TTotalDebt } from "@/pages/reports/f-manager/finance/type";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllData } from "@/service/apiHelpers";

export default function CardSort({
  KassaId,
  reportId,
  isAddible,
  kassaId,
  KassaReport,
  isOnlyCash,
  isOnlineCashFlow,
  isOnlyTerminal,
  isUserSelectble,
  ClientdebtTotal,
  isTotalPage,
}: {
  KassaId?: string;
  reportId?: string | undefined;
  isAddible?: boolean;
  KassaReport?: TKassareportData;
  kassaId?: string | undefined;
  isOnlyCash?: boolean | undefined;
  isOnlyTerminal?: boolean | undefined;
  isOnlineCashFlow?: boolean | undefined;
  isUserSelectble?: boolean | undefined;
  ClientdebtTotal?: TTotalDebt;
  isKassa?: boolean | undefined;
  isTotalPage?:boolean;
}) {
  const navigate = useNavigate();

  const { meUser } = useMeStore();
  const queryClient = useQueryClient();
  const [kassaReports] = useQueryState("kassaReports");

  const [sorttype, setSortType] = useQueryState("tip", parseAsString);
  const [type, setType] = useState<string>("income");
  const [cashflow_type, setCashflow_type] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [filial, setFilial] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [debtId, setDebtId] = useState<string | undefined>(undefined);
  const [factoryId, setFactoryId] = useState<string | undefined>(undefined);
  const [isUserLocSelectble, setisUserLocSelectble] = useState<
    boolean | undefined
  >(false);
  const [isFactorySelectble, setIsFactorySelectble] = useState(false);
  const [logisticsId, setLogisticsId] = useState<string | undefined>(undefined);
  const [isLogisticsSelectble, setIsLogisticsSelectble] = useState(false);
  const [customsId, setCustomsId] = useState<string | undefined>(undefined);
  const [isCustomsSelectble, setIsCustomsSelectble] = useState(false);

  const { data: filialData } = useDataFetch({});
  const { data: kassaData, isLoading: isReportLoading } = useKassaById({
    id: KassaId,
  });

  const { data: types } = useDataCashflowTypes({
    queries: { limit: 20, page: 1, type: type == "income" ? "in" : "out" },
    enabled: Boolean(dialogOpen),
  });

  const {
    data: DeblsData,
    //  isLoading, fetchNextPage, hasNextPage, isFetchingNextPage
  } = useDeblsData({
    queries: {
      limit: 100,
      page: 1,
    },
    enabled: Boolean(isUserLocSelectble),
  });
  const flatDeblsData =
    DeblsData?.pages?.flatMap((page) => page?.items || []) || [];

  const { data: factoriesData } = useQuery({
    queryKey: [apiRoutes.factoryReportEnabled],
    queryFn: () => getAllData<any[], undefined>(apiRoutes.factoryReportEnabled),
    enabled: Boolean(isFactorySelectble),
  });

  const { data: logisticsData } = useQuery({
    queryKey: [apiRoutes.logistics, "logistics-select"],
    queryFn: () => getAllData<any, { limit: number }>(apiRoutes.logistics, { limit: 100 }),
    enabled: Boolean(isLogisticsSelectble),
  });

  const { data: customsData } = useQuery({
    queryKey: [apiRoutes.customs, "customs-select"],
    queryFn: () => getAllData<any, { limit: number }>(apiRoutes.customs, { limit: 100 }),
    enabled: Boolean(isCustomsSelectble),
  });

  interface TColumns {
    title: string;
    value: string;
    price: React.ReactNode;
    button?: React.ReactNode;
  }
  const columns = [
    {
      title: "income",
      value: "income",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(KassaReport?.totalIncome || KassaReport?.income || kassaData?.income || 0)
      ),
      button: isAddible ? (
        <div
          onClick={() => {
            setType("income");
            setDialogOpen(true);
          }}
          className="border-border   border p-4 rounded-sm"
        >
          <Plus
            size={20}
            color={sorttype == "income" ? "#f0f0e5" : "#5D5D53"}
          />
        </div>
      ) : (
        ""
      ),
    },
    {
      value: "sale",
      title: "Продажа",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(KassaReport?.totalSale || KassaReport?.sale || kassaData?.sale || 0)
      ),
    },
    {
      value: "terminal",
      title: "Терминал",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(KassaReport?.totalPlasticSum || KassaReport?.plasticSum || kassaData?.plasticSum || 0)
      ),
    },
    {
      title: "Навар",
      value: "navar",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(
          KassaReport?.additionalProfitSum ||
            kassaData?.additionalProfitSum ||
            0
        )
      ),
    },
    {
      title: "expense",
      value: "expense",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        `-${formatPrice(KassaReport?.totalExpense || KassaReport?.expense || kassaData?.expense || 0)}`
      ),
      button: isAddible ? (
        <div
          onClick={() => {
            setType("expense");
            setDialogOpen(true);
          }}
          className="border-border   border p-4 rounded-sm"
        >
          <Plus
            size={20}
            color={sorttype == "expense" ? "#f0f0e5" : "#5D5D53"}
          />
        </div>
      ) : (
        ""
      ),
    },
    {
      title: "Возврат сумма",
      value: "return",
      price: `-${formatPrice(KassaReport?.totalSaleReturn || KassaReport?.saleReturn || kassaData?.saleReturn || 0)}`,
    },
    {
      title: "Инкассация",
      value: "collection",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(
          (KassaReport?.totalCashCollection || KassaReport?.cashCollection)
            ? Math.abs(KassaReport?.totalCashCollection || KassaReport?.cashCollection || 0)
            : kassaData?.cashCollection || 0
        )
      ),
    },
    {
      title: "Скидка",
      value: "discount",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(
          Number(KassaReport?.totalDiscount || KassaReport?.discount || kassaData?.discount) || 0
        )
      ),
    },
  ];

  const hrColumns = [
    {
      title: "Пластик",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(kassaData?.income || 0)
      ),
    },
    {
      title: "Наличному",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(kassaData?.income || 0)
      ),
    },
    {
      title: "Бонус",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(kassaData?.income || 0)
      ),
    },
    {
      title: "Аванс",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(kassaData?.income || 0)
      ),
    },
    {
      title: "Премя",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(kassaData?.income || 0)
      ),
    },
  ];

  function formatPrice(price: number): string {
    return Number(price).toFixed(2);
  }

  const handleSubmit = async () => {
    try {
      if (!cashflow_type) {
        toast.error("Выберите тип операции");
        return;
      }

      if (!price || price <= 0) {
        toast.error("Введите корректную сумму");
        return;
      }

      setIsSubmitting(true);

      const body = {
        cashflow_type,
        type,
        tip: "cashflow",
        comment,
        price,
        ...(date ? { date } : {}),
        is_online: isOnlineCashFlow || undefined,
        createdBy: meUser?.id,
        kassa: kassaId || kassaReports || (kassaReports ? undefined : kassaData?.id) || undefined,
        report: reportId || undefined,
        debtId: isUserLocSelectble ? debtId : undefined,
        factoryId: isFactorySelectble ? factoryId : undefined,
        logisticsId: isLogisticsSelectble ? logisticsId : undefined,
        customsId: isCustomsSelectble ? customsId : undefined,
      };

      await api.post(apiRoutes.cashflow, body);

      toast.success(`${type} успешно добавлен`);

      // Reset form fields
      setCashflow_type("");
      setComment("");
      setPrice(0);
      setDate("");
      setDebtId(undefined);
      setFactoryId(undefined);
      setLogisticsId(undefined);
      setIsLogisticsSelectble(false);
      setCustomsId(undefined);
      setIsCustomsSelectble(false);
      // Close dialog
      setDialogOpen(false);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["kassa-reports"] });
      queryClient.invalidateQueries({ queryKey: ["kassa-reports/total"] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes?.kassaReports] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.kassa] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reports] });
    } catch (error) {
      toast.error(String(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    setCashflow_type("");
    setComment("");
    setPrice(0);
    setDate("");
    setDebtId(undefined);
    setFactoryId(undefined);
    setLogisticsId(undefined);
    setCustomsId(undefined);
    setIsFactorySelectble(false);
    setIsLogisticsSelectble(false);
    setIsCustomsSelectble(false);
  }, [dialogOpen]);
  const column = meUser?.position.role === 11 ? hrColumns : columns;
  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="flex rounded-t-sm overflow-hidden  bg-card">
          <div
            onClick={() => setSortType(null)}
            className=" bg-sidebar/20 cursor-pointer rounded-tl-sm p-5 w-full border border-t border-r max-w-[399px]"
          >
            <div className="flex items-center">
              <DollarSign size={54} />
              <div>
                <p className="text-[12px] ">Итого</p>
                {isReportLoading ? (
                  <Skeleton className="h-7 w-24 mt-1" />
                ) : (
                  <p className={`${((kassaData?.inHand || KassaReport?.inHand || 0) >= 0) ? "text-foreground":"text-red-500"} text-[25px] font-bold `}>
                    {formatPrice(
                      isOnlyCash
                        ? KassaReport?.managerSum ||
                            KassaReport?.manegerSum ||
                            0
                        : isOnlyTerminal
                          ? KassaReport?.accountantSum || 0
                          : KassaReport?.inHand ? KassaReport?.inHand
                            : (isTotalPage &&  KassaReport?.totalSale) ? KassaReport?.totalSale : kassaData?.inHand ||0
                    )}
                  </p>
                )}
              </div>
            </div>
          
            {ClientdebtTotal ? (
              <>
                <p className="text-[12px] mt-[25px] mb-1 text-[#7E7E72]">
                  Продажа в долг:
                </p>
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/f-manager/report-finance/client-debt");
                  }}
                  className="text-[14px] text-[#E38157] hover:underline inline-block font-semibold"
                >
                  {ClientdebtTotal?.totalDebt} { ClientdebtTotal?.totalDebt ?"$":""}
                </p>
              </>
            )  :   isTotalPage ? "":(
              <div className="w-1/2 inline-block">
                <p className="text-[12px] mt-[25px] mb-1 text-[#7E7E72]">
                  Продажа в долг:
                </p>
                <p className="text-[14px] text-[#E38157]  inline-block font-semibold">
                  {KassaReport?.debtSum ? KassaReport?.debtSum : kassaData?.debtSum} { KassaReport?.debtSum || kassaData?.debtSum ? "$":""} 
                </p>
              </div>
            )}
            {
              (kassaData?.kassaReport?.filialType == "filial" || KassaReport?.filialType =="filial") ?<div className="1/2 inline-block">
                 <p className="text-[12px] mt-[25px] mb-1 text-[#7E7E72]">
                  Сальдо баланс: 
                </p>
                {
                  KassaReport ?  <p className={`text-[14px]   ${(KassaReport?.openingBalance || 0) >0 ? "text-[#89A143]" : (KassaReport?.openingBalance || 0) <0? "text-[#E38157]":"" } inline-block font-semibold`}>
                  { KassaReport?.openingBalance}  {KassaReport?.openingBalance? "$":""} 
                </p>:<p className={`text-[14px]   ${ (kassaData?.kassaReport?.openingBalance ||0) >0 ? "text-[#89A143]" : (kassaData?.kassaReport?.openingBalance || 0) <0? "text-[#E38157]":"" } inline-block font-semibold`}>
                  { kassaData?.kassaReport?.openingBalance}  {kassaData?.kassaReport?.openingBalance? "$":""} 
                </p>
                }
                </div>:""
            }
          </div>
          <div className="grid row-start w-full  border-border  border-b grid-cols-4  ">
            {(column as unknown as TColumns[])?.map((e, index) => (
              <div
                key={e.title}
                onClick={() => setSortType(e.value)}
                className={`${sorttype == e.value ? "bg-primary text-background" : "bg-sidebar/20  text-primary"} ${index == 3 ? "rounded-tr-sm" : ""}  border-t border-r border-border cursor-pointer px-4 py-5`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-[12px] mb-0.5 flex items">{e.title}</p>
                  {/* {meUser?.position?.role !== 6 && meUser?.position?.role !== 10 &&
                    "button" in e && ( */}
                  <DialogTrigger
                    onClick={(event) => {
                      event.stopPropagation();
                      setType(e.title === "expense" ? "expense" : "income");
                    }}
                  >
                    {e.button as React.ReactNode}
                  </DialogTrigger>
                  {/* )} */}
                </div>
                <p className="text-[15px] font-medium">{e.price}</p>
              </div>
            ))}
          </div>
        </div>

        <DialogContent className="sm:max-w-[640px]  costomModal rounded-sm px-4 pb-4">
          <div
            className={`p-3 h-[44px] font-bold pb-0 text-center mx-auto rounded-t-sm w-1/2 -mt-[45px]  ${type === "income" ? "bg-[#89A143]" : "bg-[#E38157]"} text-white`}
          >
            {type === "income" ? "Добавление прихода" : "Добавление расхода"}
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div
              className={`w-full  grid ${types && types?.length < 6 ? "grid-cols-2" : "grid-cols-3"} gap-0.5`}
            >
              {types
                ?.filter((i) => i?.is_visible && i?.slug !== "balance")
                ?.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCashflow_type(item.id);
                      if (item?.slug === "kent" && isUserSelectble) {
                        setisUserLocSelectble(true);
                        setIsFactorySelectble(false);
                      } else if (item?.title === "Поставщики") {
                        setIsFactorySelectble(true);
                        setisUserLocSelectble(false);
                        setIsLogisticsSelectble(false);
                      } else if (item?.slug === "logistics") {
                        setIsLogisticsSelectble(true);
                        setisUserLocSelectble(false);
                        setIsFactorySelectble(false);
                        setIsCustomsSelectble(false);
                      } else if (item?.slug === "customs") {
                        setIsCustomsSelectble(true);
                        setisUserLocSelectble(false);
                        setIsFactorySelectble(false);
                        setIsLogisticsSelectble(false);
                      } else {
                        setisUserLocSelectble(false);
                        setIsFactorySelectble(false);
                        setIsLogisticsSelectble(false);
                        setIsCustomsSelectble(false);
                      }
                    }}
                    className={`${cashflow_type === item.id ? "bg-[#5D5D53] text-[white]" : "bg-input text-primary"} flex items-center justify-center flex-col pt-4 rounded-sm text-center cursor-pointer`}
                  >
                    <img
                      src={minio_img_url + item.icon?.path}
                      style={{
                        filter:
                          cashflow_type === item.id
                            ? "invert(1) brightness(2)"
                            : "",
                      }}
                    />

                    <p className="text-[13px] font-medium my-2.5">
                      {item.title}
                    </p>
                  </div>
                ))}
            </div>
            <div className="w-full">
              {meUser?.position?.role == 10 && !isUserLocSelectble && (
                <ShadcnSelect
                  value={filial}
                  options={
                    filialData?.pages[0]?.items?.map((item) => ({
                      value: item.id,
                      label: item.title,
                    })) || []
                  }
                  placeholder={"Организации"}
                  onChange={(value) => {
                    setFilial(value || "");
                  }}
                  className="w-full text-[#5D5D53] border-none h-[90px] !bg-input !text-[22px] font-semibold rounded-sm px-[17px] py-[26px]"
                />
              )}

              {isUserLocSelectble && (
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

              {isFactorySelectble && (
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

              {isLogisticsSelectble && (
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

              {isCustomsSelectble && (
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="datetime-local"
                className="w-full border-none h-[45px] mt-0.5 text-[14px] font-semibold rounded-sm px-[17px] py-[10px]"
              />
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Комментария"
                className="w-full border-none focus:border-none outline-none mt-0.5 h-[90px] text-[13px] bg-input font-semibold rounded-sm px-2 py-2.5"
              />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`p-5 py-6 rounded-sm ${type === "income" ? "bg-[#89A143]" : "bg-[#E38157]"} text-white ${isSubmitting ? "opacity-70" : ""}`}
          >
            {isSubmitting
              ? "Добавление..."
              : `Добавить в ${type === "income" ? "приход" : "расход"}`}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
