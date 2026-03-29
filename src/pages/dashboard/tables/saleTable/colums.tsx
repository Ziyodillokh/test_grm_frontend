import { ColumnDef } from "@tanstack/react-table";


import { TData, TransferItem } from "./type";
import formatPrice from "@/utils/formatPrice";
import {  SquareArrowOutDownLeft } from "lucide-react";
import { format } from "date-fns";
import TebleAvatar from "@/components/teble-avatar";

export const Columns: ColumnDef<TData>[] = [
    {
        id: "icon",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center ">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${!item?.isDebt ? "bg-[#E7F6E7] text-white" : "bg-[#FFEBE0] text-white"}`}
                  >
                <SquareArrowOutDownLeft className={`h-6 w-6  ${!item?.isDebt ?  "text-[#85D188]" : "text-[#D76B43] "}`} />
                </div>
                <TebleAvatar status={"none"} className="-ml-2 w-[40px] h-[40px]" size={40} name={ item?.seller?.firstName} url={item?.seller?.avatar?.path} />
                <TebleAvatar status={"none"} className="-ml-2 w-[40px] h-[40px]" size={40}  name={ item?.casher?.firstName} url={item?.casher?.avatar?.path} />
              </div>
          );
        },
      },
      {
        id: "price",
        header:"Наличие",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <span
              className={`font-bold  text-nowrap text-[16px] `}
            >
              {formatPrice(item?.price || 0) }$
            </span>
          );
        },
      },
     
     
      {
        id: "collection",
        header:"collection",
        cell: ({ row }) => {
          const item = row.original;
          return (
          <p >
            {item?.bar_code?.collection?.title}
          </p>
          );
        },
      },
      {
        id: "model",
        header:"model",
        cell: ({ row }) => {
          const item = row.original;
          return (
          <p >
            {item?.bar_code?.model?.title}
          </p>
          );
        },
      },
      {
        id: "size",
        header:"size",
        cell: ({ row }) => {
          const item = row.original;
          return (
          <p >
            {item?.bar_code?.size?.title}
          </p>
          );
        },
      },
      {
        id: "color",
        header:"color",
        cell: ({ row }) => {
          const item = row.original;
          return (
          <p >
            {item?.bar_code?.color?.title}
          </p>
          );
        },
      },
    
      {
        id: "time",
        header: "Дата",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <p className="text-[13px] min-w-[80px] text-[#B5B5B5]">
              {format(item?.date, "dd MMM HH:mm")}
            </p>
          );
        },
      },
   

];

export const DealerColumns: ColumnDef<TransferItem>[] = [
  {
      id: "icon",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center ">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${ "bg-[#FFEBE0] text-white"}`}
                >
              <SquareArrowOutDownLeft className={`h-6 w-6  ${ "text-[#D76B43] "}`} />
              </div>
              <TebleAvatar status={"none"} className="-ml-2 w-[40px] h-[40px]" size={40} name={ item?.transferer?.firstName} url={item?.transferer?.avatar?.path} />
              <TebleAvatar status={"none"} className="-ml-2 w-[40px] h-[40px]" size={40}  name={ item?.manager?.firstName} url={item?.manager?.avatar?.path} />
            </div>
        );
      },
    },
    {
      id: "price",
      header:"Наличие",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <span
            className={`font-bold  text-nowrap text-[16px] `}
          >
            {formatPrice(item?.comingPrice * item?.kv || 0) }$
          </span>
        );
      },
    },
   
   
    {
      id: "collection",
      header:"collection",
      cell: ({ row }) => {
        const item = row.original;
        return (
        <p >
          {item?.product?.bar_code?.collection?.title}
        </p>
        );
      },
    },
    {
      id: "model",
      header:"model",
      cell: ({ row }) => {
        const item = row.original;
        return (
        <p >
          {item?.product?.bar_code?.model?.title}
        </p>
        );
      },
    },
    {
      id: "size",
      header:"size",
      cell: ({ row }) => {
        const item = row.original;
        return (
        <p >
          {item?.product?.bar_code?.size?.title}
        </p>
        );
      },
    },
    {
      id: "color",
      header:"color",
      cell: ({ row }) => {
        const item = row.original;
        return (
        <p >
          {item?.product?.bar_code?.color?.title}
        </p>
        );
      },
    },
  
    {
      id: "time",
      header: "Дата",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <p className="text-[13px] min-w-[80px] text-[#B5B5B5]">
            {format(item?.date, "dd MMM HH:mm")}
          </p>
        );
      },
    },
 

];
