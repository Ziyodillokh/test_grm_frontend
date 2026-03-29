import { ColumnDef } from "@tanstack/react-table";
import {
  Delete,
  FileOutput,
  Loader,
  MessageSquareText,
  Minus,
  MoreHorizontal,
  Plus,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import formatPrice from "@/utils/formatPrice";

import { KassaItem, TransactionItem } from "../type";
import { format } from "date-fns";
import { useMeStore } from "@/store/me-store";
import TebleAvatar from "@/components/teble-avatar";
import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { UpdatePatchData } from "@/service/apiHelpers";
import { useQueryClient } from "@tanstack/react-query";

export const ReportColumns: ColumnDef<TransactionItem>[] = [
  {
    id: "icon",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div
          className={`w-12 h-12 flex items-center justify-center ${item.type === "Приход" ? "bg-[#89A143] text-white" : "bg-[#E38157] text-white"}`}
        >
          {item?.tip === "order" ? (
              item?.type === "Приход"? 
                <ShoppingCart  className={`h-6 w-6`} />:
                <Delete className={`h-6 w-6`} /> 
          
          ) :
           item?.type === "Приход" ? <Plus className="h-6 w-6 "/> :  <Minus className="h-6 w-6" />
          }
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
          className={`font-bold text-[16px] ${item.type === "Приход" ? "text-[#89A143]" : "text-[#E38157]"}`}
        >
          {item?.type === "Приход" ? "+" : "-"}
          {item?.tip =="order" && item?.type != "Расход"  ? formatPrice(item?.order?.price || 0) :formatPrice(item?.price || 0) }$
        </span>
      );
    },
  },
  {
    id: "terminal",
    header:"Терминал",
    cell: ({ row }) => {
      const item = row.original;
      return (
        item.type === "Приход"?
        <span
          className={`font-bold text-[16px]  text-[#58A0C6]`}
        >
          { formatPrice(item?.order?.plasticSum || 0)}$
        </span>:""
      );
    },
  },
 
  {
    id: "type",
    header:"Тип",
    cell: ({ row }) => {
      const item = row.original;
      return (
      <div >
          <Button
          className={`${item?.type !== "Приход" ? "text-[#E38157] border-[#E38157] hover:text-[#E38157]" : "text-[#89A143] border-[#89A143] hover:text-[#89A143]"}  rounded-[70px] p-[14px] h-10 `}
          variant={"outline"}
        >
          {item?.cashflow_type?.title}
        </Button>
      </div>
      );
    },
  },
  {
    id: "comment",
    header:"Подробнее информации",
    cell: ({ row }) => {
      const item = row.original;
      return (
      item.tip == "cashflow" ?   <p className="text-[13px] text-muted-foreground flex gap-1">
      {item?.comment && <MessageSquareText width={14} />}
      {item.product || item?.comment}
    </p>:  
    <div className="flex  items gap-10 xl:gap-14">
        <p  className="text-[13px] text-muted-foreground">
            {item.order?.bar_code?.collection?.title}
        </p>
        <p  className="text-[13px] text-muted-foreground">
        { item.order?.bar_code?.model?.title}
        </p>
        <p className="text-[13px] text-muted-foreground">
          {item?.tip === "order" && item?.order?.bar_code?.size?.title}
        </p>
        <p className="text-[13px] text-muted-foreground">
          {item?.tip === "order" && item?.order?.bar_code?.color?.title}
        </p>
        </div>
      );
    },
  },

  {
    id: "quantity",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[13px] text-muted-foreground">
          {row.original?.tip === "order" && item?.order?.x ?
          ` ${ item?.order?.x } ${ item?.order?.bar_code?.isMetric  ?  ""  :"x"}`
          :
          "" }
          
        </p>
      );
    },
  },
  {
    id: "discount",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <p className="text-[13px] text-[#E38157]">
          {item?.tip === "order" && item?.order?.discountSum ?    `-${item?.order?.discountSum}$`:''} 
        </p>
      );
    },
  },
 

  {
    id: "filial",
    header:"Филиал",
    cell: ({row}) => {
      const { meUser } = useMeStore();
      const item = row.original;
      return (
        meUser?.position?.role == 10  ||  meUser?.position?.role == 9? <div >
          <Button
          className={`bg-[#E6E6D9] border-0  rounded-[5px] p-[14px] h-10 `}
          variant={"outline"}
        >
          {item?.filial?.name}
        </Button>
      </div>:""
      );
    },
  },
  {
    header: "Продавец",
    id: "closer",
    cell: ({ row }) => {
      const item = row.original;
      return item?.order?.seller?.avatar && <TebleAvatar status={"success"} name={ item?.order?.seller?.firstName} url={item?.order?.seller?.avatar?.path} />
       
    },
  },
  {
    header: "Кассир",
    id: "closer",
    cell: ({ row }) => {
      const item = row.original;
      return    <TebleAvatar status={item?.is_cancelled ? "fail": "success"} name={ item?.casher?.firstName} url={item?.casher?.avatar?.path} />

   
       
    },
  },
    {
    id: "time",
    cell: ({ row }) => {
      const item = row.original;
      return <p className="text-[13px]">{format(item?.date, "dd MMM HH:mm")}</p>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({row}) => {
      const [loading,setLoading] = useState(false)
      const queryClient = useQueryClient();
      const RejectFunt = () => {
        setLoading(true)
        UpdatePatchData(apiRoutes.cashflow +"/"+ row?.original?.id+"" ,"cancel",{})
          .then(() => {
              toast.success("Успешно отменено");
            queryClient.invalidateQueries({ queryKey: [apiRoutes.cashflow] });
          })
          .finally(()=>setLoading(false));
      };
    
      return(
     
        <TableAction
          ShowUpdate={false}
          ShowDelete={row?.original?.tip != "order"}
          url={apiRoutes.cashflow}
          refetchUrl={apiRoutes.cashflow}
          id={row?.original?.id + ""}
        >
        { (row?.original?.tip == "order" && row?.original?.type!="Расход") &&  <DropdownMenuItem className="text-center flex items-center justify-center pt-[14px] pb-[8px]">
              <div
                onClick={loading ? ()=>{} :() => RejectFunt()}
                className="w-full text-center"
              >
               {loading? <Loader/>: <FileOutput
                  size={28}
                  width={28}
                  height={28}
                  className="w-[28px] m-auto h-[28px] text-[#EC6C49]"
                />}
                <p className="text-[#EC6C49] text-[13px]">Возрат</p>
              </div>
          </DropdownMenuItem>}
        </TableAction>
      )
    },
  },
];

export const KassaColumns: ColumnDef<KassaItem>[] = [
  {
    id: "startDate",
    header:"Дата",
    cell: ({ row }) => {
      const item = row.original;
      return (
      <p className={`${item?.endDate ?'':  'text-[#89A143]'}`}> {item?.endDate?  format(new Date(item?.endDate), "dd MMMM yyyy") :"Продалажется"}</p>
      );
    },
  },
  {
    header:"Сумма",
    id: "totalSum",
    cell: ({ row }) => {
      const item = row.original;
      return (
      <p  className="text-[#89A143]"> {item?.totalSum} $</p>
      );
    },
  },

  {
    header:"Терминал",
    id: "plasticSum",
    cell: ({ row }) => {
      const item = row.original;
      return (
      <p > {item?.plasticSum} $</p>
      );
    },
  },

  {
    header:"Скидка",
    id: "discount",
    cell: ({ row }) => {
      const item = row.original;
      return (
      <p > {item?.discount} $</p>
      );
    },
  },

  {
    header:"Навар",
    id: "additionalProfitTotalSum",
    cell: ({ row }) => {
      const item = row.original;
      return (
      <p > {item?.additionalProfitTotalSum} $</p>
      );
    },
  },

  {
    header:"Объём",
    id: "totalSize",
    cell: ({ row }) => {
      const item = row.original;
      return (
      <p > {item?.totalSize} м²</p>
      );
    },
  },
  {
    header:"Приход",
    id: "income",
    cell: ({ row }) => {
      const item = row.original;
      return (
      <p > {item?.income} $</p>
      );
    },
  },
  {
    header:"Расход",
    id: "expense",
    cell: ({ row }) => {
      const item = row.original;
      return (
      <p > {item?.expense} $</p>
      );
    },
  },
  {
    header:"Инкассация",
    id: "cash_collection",
    cell: ({ row }) => {
      const item = row.original;
      return (
      <p > {item?.cash_collection} $</p>
      );
    },
  },
 
  {
    id: "actions",
    header: "actions",
    cell: () => (
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];

