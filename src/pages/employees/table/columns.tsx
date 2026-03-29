import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import TableAction from "@/components/table-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { minio_img_url } from "@/constants";
import { apiRoutes } from "@/service/apiRoutes";
import { useMeStore } from "@/store/me-store";

import { TData } from "../type";
import { useState } from "react";

export const FilialColumns: ColumnDef<TData>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "№",
    cell: ({ row }) => {
      return <>{row.index + 1}</>;
    },
  },
  {
    header: "Фото",
    cell: ({ row }) => {
      return (
        <Avatar className="w-[40px] h-[40px]">
          <AvatarImage src={minio_img_url + row.original?.avatar?.path} />
          <AvatarFallback className="bg-primary text-white w-[40px] flex items-center justify-center h-[40px]">
            {row.original?.firstName?.[0]}
            {row.original?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    header: "Фамилия имя",
    cell: ({ row }) => {
      return (
        <p>
          {row.original?.firstName} {row.original?.lastName}
        </p>
      );
    },
  },

  {
    header: "Флиал",
    cell: ({ row }) => {
      return <p>{row.original?.filial?.title}</p>;
    },
  },
  {
    header: "Должность",
    cell: ({ row }) => {
      return (
        <p className="border-border border px-4 py-2 rounded-[60px] inline-block">
          {row.original?.position?.title}
        </p>
      );
    },
  },
  {
    header: "Рабочая время",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <p className="text-[#E38157]">{row?.original?.from} </p>
          <p>до</p>
          <p className="text-[#89A143]">{row?.original?.to} </p>
        </div>
      );
    },
  },
  {
    header: "Дата риёма",
    cell: ({ row }) => {
      return format(row.original?.hired, "dd.MM.yyyy");
    },
  },
  {
    header: "Зарплата",
    cell: ({ row }) => {
      return <p>{Number(row?.original?.salary).toLocaleString("uz-UZ")} $ </p>;
    },
  },

  {
    header: "id для входа",
    accessorKey: "login",
    cell: ({ row }) => {
      const login = row.original?.login;
      const [copied, setCopied] = useState(false);
      const handleCopy = () => {
        navigator.clipboard.writeText(login);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
      };
      return (
        <div>
          <p onClick={handleCopy} style={{ cursor: "pointer" }}>
            {login}
          </p>
          {copied && <span style={{ color: "green" }}>Copied!</span>}
        </div>
      );
    },
  },
  {
    header: "Телефон",
    accessorKey: "phone",
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      const { meUser } = useMeStore();
      return (
        meUser?.position.role == 11 && (
          <TableAction url={apiRoutes.user} id={row.original?.id} />
        )
      );
    },
  },
];
