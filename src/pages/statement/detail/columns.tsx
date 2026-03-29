import { ColumnDef } from "@tanstack/react-table";
import { Gem, Gift, IdCardIcon } from "lucide-react";


import { Statement } from "../type";
import TebleAvatar from "@/components/teble-avatar";
import TableAction from "@/components/table-action";
import { apiRoutes } from "@/service/apiRoutes";

export const StatementEmployeeColumns = (): ColumnDef<Statement>[] => {
  return [
    {
      id: "employee",
      header: "Сотрудник",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center">
           <TebleAvatar  status="none"  url={row.original?.user?.avatar?.path} name={row.original?.user?.firstName}/>
            <div className="font-normal text-foreground tetx-[13px]">
              {row.original?.user?.firstName}
              {row.original?.user?.lastName}
            </div>
          </div>
        );
      },
      size: 200,
    },
    {
      header: "Филиал",
      accessorKey: "filial",
      cell: ({ row }) => {
        return (
          <div className="bg-card py-[12px] px-[16px] rounded-full inline-block text-[#5D5D53] text-[12px]">
            {row.original?.user?.filial}
          </div>
        );
      },
    },
    {
      header: "Зарплата",
      accessorKey: "salary",
      cell: ({ row }) => {
        return (
          <span className="text-[#E38157] flex items-center">
            {" "}
            <IdCardIcon className="mr-1 text-[12px]" size={18} />{" "}
            {row.original?.user?.salary} $
          </span>
        );
      },
    },
    {
      header: "Бонус",
      accessorKey: "bonus",
      cell: ({ row }) => {
        return typeof row.original?.bonus  ? (
          <span className="text-[#C3AD54] flex items-center">
            <Gem className="mr-1 text-[12px]" size={18} /> {row.original?.bonus?.title} 
          </span>
        ) : (
          <span>—</span>
        );
      },
    },
    {
      header: "Премии",
      accessorKey: "premium",
      cell: ({ row }) => {
        return row.original?.award ? (
          <span className="text-[#94C3DC] flex items-center">
            <Gift className="mr-1 text-[12px]" size={18} /> 
            {row.original?.award?.title} 
          </span>
        ) : (
          <span>—</span>
        );
      },
    },
    {
      header: "Аванс",
      accessorKey: "prepayment",
      cell: ({ row }) => {
        return row.original?.prepayment ? (
          <span className="text-[#E38157] flex items-center">
            {" "}
            <IdCardIcon className="mr-1 text-[12px]" size={18} />{" "}
            {row.original?.prepayment} $
          </span>
        ) : (
          <span>—</span>
        );
      },
    },
    {
      header: "Итого",
      accessorKey: "total",
      cell: ({ row }) => {
        return (
          <span className="font-medium text-[#5D5D53] text-[16px]">
            {row.original?.total} $
          </span>
        );
      },
    },
    {
      header: "Пластик",
      accessorKey: "plastic",
      cell: ({ row }) => {
        return (
          <span className="p-2 border bg-card">
            {row.original?.plastic} $
          </span>
        );
      },
    },
    {
      header: "Наличные",
      accessorKey: "cash",
      cell: ({ row }) => {
        return (
          <span className="p-2 border bg-[#EAEADE]">{row.original?.in_hand} $</span>
        );
      },
    },
    {
      id: "actions",
      cell: ({row}) => (
        <>
        <TableAction
          id={row?.original?.id + ""}
          url={apiRoutes.payrollItems}
          refetchUrl={apiRoutes.payrollItems}
        />
        </>
      ),
    },
  ];
};
