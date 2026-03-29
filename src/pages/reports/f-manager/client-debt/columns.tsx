import { ColumnDef } from "@tanstack/react-table";
import { TData } from "./type";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TebleAvatar from "@/components/teble-avatar";
import { format } from "date-fns";


export const DebtClientolumns: ColumnDef<TData>[] = [

  {
    header: "Дата",
    id: "icons",
    cell: () => {
      return (
        <div
        className={`w-12 h-12 flex items-center justify-center bg-[#89A143] text-white`}
      >
        <ShoppingCart  className={`h-6 w-6`} />:
        
      </div>
      );
    },
  },
  {
    header: "Задолжность",
    id: "icons",
    cell: ({row}) => {
      return (
        <p className=" text-[#E38157]">{row?.original?.price} $</p>
      );
    },
  },
  {
    header: "Тип",
    id: "icons",
    cell: () => {
      return (
        <Badge
        variant="outline"
        className={`min-w-[100px] border-[#89A143]  text-[#89A143]  py-[10px] px-[14px] rounded-[63px]`}
      >
      Долг
      </Badge>
      );
    },
  },
  {
    header: "Коллекция",
    id: "collection",
    cell: ({row}) => {
      return (
       <p>{row?.original?.product?.bar_code?.collection?.title}</p>
      );
    },
  },
  
  {
    header: "Модель",
    id: "model",
    cell: ({row}) => {
      return (
       <p>{row?.original?.product?.bar_code?.model?.title}</p>
      );
    },
  },
  {
    header: "Размер",
    id: "size",
    cell: ({row}) => {
      return (
       <p>{row?.original?.product?.bar_code?.size?.title}</p>
      );
    },
  },
  {
    header: "Цена за",
    id: "price",
    cell: ({row}) => {
      return (
       <p>{row?.original?.product?.bar_code?.collection?.priceMeter} $</p>
      );
    },
  },
  {
    header: "Количество",
    id: "price",
    cell: ({row}) => {
      return (
       <p>{row?.original?.x} </p>
      );
    },
  },
  {
    header: "Скидка",
    id: "discountSum",
    cell: ({row}) => {
      return (
       <p>{row?.original?.discountSum} $ </p>
      );
    },
  },
  
  {
    header: "Продавец",
    id: "seller",
    cell: ({row}) => {
      return (
        <TebleAvatar status="none" name={row?.original?.seller?.firstName} url={row?.original?.seller?.avatar?.path}/>
      );
    },
  },
  {
    header: "Клиент",
    id: "seller",
    cell: ({row}) => {
      return (
       <div>
          <p className="text-primary">{row?.original?.client?.fullName}</p>
          <p className="text-[#58A0C6] text-[13px]">{row?.original?.client?.phone}</p>
        </div>
      );
    },
  },
  {
    header: "Дата и время",
    id: "seller",
    cell: ({row}) => {
      return (
     <p>{ format(row?.original.date, "dd-MM-yyyy HH:MM")}</p>
      );
    },
  }
];
