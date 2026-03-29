import { Banknote, DollarSign, Plus } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRoutes } from "@/service/apiRoutes";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/service/fetchInstance";
import { TKassareportData } from "@/pages/report/type";

export default function CardSort({kassaReportId,isAddable,SortData}:{kassaReportId?:string,isAddable?:boolean,SortData?:TKassareportData}) {
  const queryClient = useQueryClient();
  const [sorttype, setSortType] = useQueryState("sorttype", parseAsString);
  const [type, setType] = useState<string>("Приход");
  const [typePay, setTypePay] = useState<string>("cash");
  const isReportLoading = false;
  const [comment, setComment] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const columns = [
    {
      title: "Объём",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) :(
        formatPrice(
          SortData?.debt_kv || 0 )
      ),
    },
    {
      title: "Отправлено",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(
          SortData?.debt_sum || 0 )
      ),
    },

    {
      title: "Навар",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(
          SortData?.debt_profit_sum || 0 )
      ),
    },
    
    {
      title: "Получено",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        formatPrice(
          SortData?.totalIncome || 0 )
      ),
      button: (
        <div
          onClick={() => setType("Приход")}
          className="bg-card p-4 rounded-4xl"
        >
          <Plus size={20} color="#5d5d53" className="opacity-100" />
        </div>
      ),
    },
    {
      title: "Итого задолжность",
      price: isReportLoading ? (
        <Skeleton className="h-5 w-12" />
      ) : (
        (
          formatPrice(
            SortData?.kassaReportStatus == 2? (SortData.filial?.owed || 0) : (SortData?.dealer_frozen_owed||0)
             )
        )
      )
    },
  ];


  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!price || price <= 0) {
        toast.error("Введите корректную сумму");
        return;
      }
      const body = {
        comment,
        price,
        kassa_report:kassaReportId,
        is_online:typePay =="cash"? false : true, 
      };
      await api.post(apiRoutes.cashflowDealerIncome, body);

      toast.success(
        `${type === "Приход" ? "Приход" : "Задолжность"} успешно добавлен`
      );

      setComment("");
      setPrice(undefined);
      setDialogOpen(false);
      setLoading(false);
      setTypePay("cash")
      queryClient.invalidateQueries({ queryKey: [apiRoutes?.kassaReports] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes?.cashflow] });
    } catch (error) {
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  };

  function formatPrice(price: number): string {
    return Number(price).toFixed(2);
  }
  useEffect(()=>{
    setTypePay("cash")
    setComment("");
    setPrice(undefined);
  },[dialogOpen])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className=" flex bg-sidebar">
        <div className="bg-sidebar p-5 pl-7 w-full border-border border-r max-w-[399px]">
          <div className="flex items-center">
            <DollarSign size={54} />
            <div>
              <p className="text-[12px] ">Итого получено</p>
              {false ? (
                <Skeleton className="h-7 w-24 mt-1" />
              ) : (
                <p className="text-[25px] font-bold text-foreground">{formatPrice(SortData?.totalIncome || 0)}</p>
              )}
            </div>
          </div>
          <p className="text-[12px] mt-[15px] mb-1 text-[#5D5D53]">
            Объём долга:
          </p>
          <p className="text-[14px] font-semibold">{SortData?.debt_kv} м²</p>
        </div>
        <div className="grid row-start w-full  grid-cols-3  ">
          {columns?.map((e) => (
            <div
              key={e.title}
              onClick={() => setSortType(e.title)}
              className={`${sorttype == e.title ? "bg-primary   text-background" : "bg-sidebar  text-primary"} ${e.button ? "" : "border-b"} h-[78px] border-border border-r  flex justify-between items-center cursor-pointer px-4 py-5`}
            >
              <div className="">
                <p className="text-[12px] mb-0.5 flex  items">{e.title}</p>
                <p className="text-[15px]  font-medium">{e.price}</p>
              </div>
              {("button" in e && isAddable) && (
                <DialogTrigger
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  {e.button as React.ReactNode}
                </DialogTrigger>
              )}
            </div>
          ))}
        </div>
      </div>

      <DialogContent className="costomModal border-0 gap-[0px] min-w-[494px] p-1 rounded-[10px]">
        <div
          className={`p-3 h-[44px] font-bold pb-0 text-center mx-auto rounded-t-[7px] w-1/2 -mt-[48px]  ${type === "Приход" ? "bg-[#89A143]" : "bg-[#E38157]"} text-white`}
        >
          {type === "Приход" ? "Добавление прихода" : "Добавление  задолжность"}
        </div>
        <div className={ type === "Приход" ?`grid grid-cols-2 gap-1`:''}>
          <div className="w-full">
            <div className="flex pl-2 items-center bg-input rounded-[7px] h-[90px]">
              <Input
                placeholder="0.00"
                value={price || undefined}
                type="number"
                min={0}
                onChange={(e) => {
                  const value = e.target.value;
                    setPrice(Number(value));
                }
                }
                className="w-full border-none h-[90px] placeholder:text-[32px] !text-[32px] font-semibold rounded-[7px] bg-transparent px-0"
              />
              <div className="text-4xl text-[#5D5D53] mx-4">$</div>
            </div>
           { type === "Приход" ? <div className="text-center mt-1 w-full bg-input p-1  rounded-[7px]">
              <div className="flex items-center justify-center mt-[18px] mb-2">
                <Banknote />
              </div>
              <div className="flex cursor-pointer relative rounded-[5px] p-0.5 items-center bg-primary">
                <div
                  className={`${typePay == "cash" ? " left-0.5 " : "left-[120px] "} transition-all duration-300 ease-in-out w-[118px] absolute rounded-[3px] top-0.5 h-[31px] bg-input`}
                ></div>
                <p
                  onClick={() => setTypePay("cash")}
                  className={`${typePay == "cash" ? "text-primary" : "text-input "} text-[13px] p-[6px]  transition-all duration-300 ease-in-out z-10 w-full text-center rounded-[3px]  font-medium`}
                >
                  Наличий
                </p>
                <p
                  onClick={() => setTypePay("online")}
                  className={`${typePay == "online" ? "text-primary " : "text-input "} text-[13px] p-[6px] transition-all duration-300 ease-in-out  z-10   w-full text-center rounded-[3px]  font-medium`}
                >
                  Онлайн
                </p>
              </div>
            </div>:""}
          </div>
          <Textarea
            placeholder="Комментария"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={`${type === "Приход" ? " h-full":""} w-full border-none focus:border-none outline-none mt-0.5  text-[13px] bg-input font-semibold rounded-[7px] px-2 py-2.5`}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          type="submit"
          className={`p-5 mt-[6px]   rounded-[7px] h-[50px] ${type === "Приход" ? "bg-[#89A143] hover:bg-[#799132]" : "bg-[#E38157] hover:bg-[#D27047]"} text-white ${false ? "opacity-70" : ""}`}
        >
          {loading
            ? "Добавление..."
            : `Добавить в ${type === "Приход" ? "приход" : "задолжность"}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
