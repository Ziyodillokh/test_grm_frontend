import {  DollarSign, Plus } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import { Skeleton } from "@/components/ui/skeleton";
import { Dialog } from "@/components/ui/dialog";
import {  useState } from "react";

import { TKassareportData } from "@/pages/report/type";

export default function CardSort({SortData}:{SortData?:TKassareportData}) {

  const [sorttype, setSortType] = useQueryState("sorttype", parseAsString);

  const isReportLoading = false;

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
            SortData?.reportStatus == 2? (SortData?.owed ||0 ): (SortData?.dealer_frozen_owed  || 0) )
        )
      )
    },
  ];

  function formatPrice(price: number): string {
    return Number(price).toFixed(2);
  }
 
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
            
            </div>
          ))}
        </div>
      </div>

    
    </Dialog>
  );
}
