import {
  FileOutput,
  Loader,
  MessageSquareText,
  MoreVertical,
  OctagonX,
} from "lucide-react";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { IData } from "@/pages/cashier/home/type";
import { useMeStore } from "@/store/me-store";
import { AddData, getAllData, UpdatePatchData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import TebleAvatar from "../teble-avatar";
import { useEffect, useState } from "react";
import { TResponse } from "@/types";
import { format } from "date-fns";



interface IDataCostom {
  dateOne: string;
  dateTwo: string;
  deletedDate: null;
  id: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  totalSellCount: number;
  totalSum: number;
  additionalProfitTotalSum: number;
  netProfitTotalSum: number;
  totalSize: number;
  plasticSum: number;
  internetShopSum: number;
  sale: number;
  return_sale: number;
  cash_collection: number;
  discount: number;
  income: number;
  expense: number;
  in_hand: number;
  debt_count: number;
  debt_kv: number;
  debt_sum: number;
  status: string;
  is_cancelled: boolean;

}
interface ICarpetCard {
  id: string;
  className?: string;
  model: string;
  size: string;
  count: string;
  img: string;
  price: string;
  plasticSum: string;
  priceMitr: string;
  color: string;
  colaction: string;
  discount: string;
  tags: string[];
  index: number;
  date: string;
  comment: string;
  status?: string;
  isDebt?:boolean;
  onCheckedChange: (e: boolean) => void;
  seller: IData["seller"];
}

export default function CarpetCashierCard({
  className,
  onCheckedChange,
  id,
  status,
  seller,
  priceMitr,
  model,
  index,
  size,
  price,
  plasticSum,
  discount,
  count,
  comment,
  img,
  colaction,
  tags,
  date,
  isDebt,
}: ICarpetCard) {
  const { meUser } = useMeStore();
  const queryClient = useQueryClient();
  const filialId = meUser?.filial.id;
  const [isloading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const AccepedFunt = (kassaId?:string) => {
    setLoading(true);

    AddData(apiRoutes.order + "/accept", {
      ids:[id],
      kassa_id: kassaId || null,
    })
      .then(() => {
        toast.success("Подтверждено успешно");
        queryClient.invalidateQueries({ queryKey: [apiRoutes.orderByKassa] });
        queryClient.invalidateQueries({ queryKey: [apiRoutes.openKassa] });
        
      })
      .catch(() => toast.error("что-то пошло не так"))
      .finally(()=>setLoading(false));
  };

  const RejectFunt = (type: string) => {
    setLoading(true);
    UpdatePatchData(apiRoutes.order + `/${type}`, id, {})
      .then(() => {
        if (type == "reject") {
          toast.error("Успешно отменено");
        } else {
          toast.success("Успешно возвращено");
        }
        queryClient.invalidateQueries({ queryKey: [apiRoutes.orderByKassa] });
      })
      .catch(() => toast.error("что-то пошло не так"))
      .finally(() => setLoading(false));
  };

  const { data, isLoading } = useQuery({
    queryKey: [apiRoutes.filial, filialId],
    queryFn: () =>
      getAllData<TResponse<IDataCostom>, object>("/kassa/warning-kassas", {
        filialId: filialId,
      }),
    enabled: open,
  });

  useEffect(()=>{
    if(data?.meta && !data?.items?.length && !isLoading && open){
      AccepedFunt()
      setOpen(false)
    }
  },[data,open])

  return (
      <label
        className={`w-full flex   gap-4 relative p-1 rounded-[12px]  ${isDebt ?"bg-sidebar":"bg-sidebar" } ${className && className}`}
      >
        <Checkbox
          onCheckedChange={onCheckedChange}
          className="absolute data-[state=checked]:bg-[#89A143] data-[state=checked]:border-[#89A143] w-[20px] h-[20px] rounded-full bg-background top-2 left-2 "
        />
            <p className="text-[14] absolute bottom-2 left-3  ">{index + 1}</p>
        <img
          className="object-cover min-w-[120px] rounded-[12px] h-full"
          style={{ aspectRatio: "0.72/1" }}
          src={img}
          width={120}
          height={140}
          alt="img"
        />
        <div className="w-full pt-[20px] px-[12px]">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center justify-between flex-wrap w-2/3">
              <p className="text-[18px] font-semibold text-primary">
                {colaction}
              </p>
              <p className="text-[18px] font-semibold text-primary">
                {model}
              </p>
              <p className="text-[18px] font-semibold text-primary">{size}</p>
              <p className="text-[18px] font-semibold text-primary">
                {priceMitr}
              </p>
              <p className="text-[18px] font-semibold text-primary">
                {count}
              </p>
            </div>
            <p className="text-[18px] font-semibold text-[#E38157]">
              {discount === null ? "~" : discount}
            </p>
            <div className="flex justify-between">
              <p className="text-[18px] font-semibold text-primary">
                {price}
              </p>
              <p className="text-[18px] ml-2 font-semibold text-[#58A0C6]">
                {plasticSum}
              </p>
            </div>
          </div>
          <div className="mt-[14px] flex  items-start justify-between gap-7 mb-0">
            <div className="flex w-full gap-[4px] flex-wrap">
              {tags?.map((e) => (
                <p
                  key={e}
                  className={
                    "inline-block text-pretty text-[12px] font-light border-border border rounded-[70px] px-2.5 py-1"
                  }
                >
                  {e}
                </p>
              ))}
            </div>
            <div className="flex gap-1 items-center">
              {seller && (
                <TebleAvatar
                  name={seller?.firstName}
                  url={seller?.avatar?.path}
                  status="success"
                />
              )}
              {status != "progress" && meUser && (
                <TebleAvatar
                  name={meUser?.firstName}
                  url={meUser?.avatar?.path}
                  status={
                    status === "canceled" || status === "rejected"
                      ? "fail"
                      : "success"
                  }
                />
              )}
              {status == "progress" ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger className="text-end" asChild>
                    <Button
                      disabled={isloading}
                      className="rounded-[70px] p-[14px] h-10 text-white bg-[#89A143]"
                    >
                      Подтвердить
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-[206px]" align="end">
                    {isLoading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      data?.items?.map((e) => (
                        <DropdownMenuItem
                        onClick={() => AccepedFunt(e?.id)}
                          key={e?.id}
                          className="text-center cursor-pointer flex items-center justify-center pt-[14px] pb-[8px]"
                        >
                          {e?.status =="open" ?"текущая касса":   format(e?.endDate , "dd.MM.yyyy")}
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  className={`${status == "rejected" ? "text-[#E38157] border-[#E38157] hover:text-[#E38157]" : status == "accepted" ? "text-[#89A143] border-[#89A143] hover:text-[#89A143]" : "text-primary border-primary hover:text-primary"} rounded-[70px] p-[14px] h-10 `}
                  variant={"outline"}
                >
                  {status === "rejected"
                    ? "Отменено"
                    : status === "canceled"
                      ? "Возвращено"
                      : "Подтверждено"}
                </Button>
              )}

              {status == "rejected" || status == "canceled" ? (
                ""
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-end" asChild>
                    <Button className="w-10 h-10 rounded-full text-primary bg-background hover:text-[#F0F0E5]">
                      <MoreVertical className="h-4 w-4 hover:text-[#F0F0E5]" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-[206px]" align="end">
                    <DropdownMenuItem className="text-center flex items-center justify-center pt-[14px] pb-[8px]">
                      {status === "progress" ? (
                        <div
                          onClick={
                            isloading ? () => {} : () => RejectFunt("reject")
                          }
                          className="w-full text-center"
                        >
                          <OctagonX
                            size={28}
                            width={28}
                            height={28}
                            className="w-[28px] m-auto h-[28px] text-[#EC6C49]"
                          />
                          <p className="text-[#EC6C49] text-[13px]">Отменить</p>
                        </div>
                      ) : (
                        <div
                          onClick={
                            isloading ? () => {} : () => RejectFunt("return")
                          }
                          className="w-full text-center"
                        >
                          <FileOutput
                            size={28}
                            width={28}
                            height={28}
                            className="w-[28px] m-auto h-[28px] text-[#EC6C49]"
                          />
                          <p className="text-[#EC6C49] text-[13px]">Возрат</p>
                        </div>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          <div className="flex items-center  justify-between gap-2 mt-[30px] text-[10px] text-primary">
            <p className="text-[13px] flex items-center text-muted-foreground gap-1">
              {comment && <MessageSquareText width={14} />}
              {comment}
            </p>
            {/* FD6F33 */}
            {isDebt && <p className="ml-auto text-[#EC6C49] text-[13px]">Продано в долг</p>}
            <p className="text-[13px]">{date}</p>
          </div>
        </div>
      </label>
  );
}
