import { ColumnDef } from "@tanstack/react-table";

import { apiRoutes } from "@/service/apiRoutes";

import { DiscountData } from "../type";
import TableAction from "@/components/table-action";


export const getColumns = (role?: number): ColumnDef<DiscountData>[] => [
  {
    header: "Название",
    cell: ({ row }) => {
      return <p>{role ? row.original?.title : row.original?.title}</p>;
    },
  },
  {
    header: "Скидка",
    cell: ({ row }) => {
      return <p>{row.original?.discountPercentage} %</p>;
    },
  },
  {
    id: "actions",
    enableHiding: true,
    header: () => <div className="text-right">{"actions"}</div>,
    size: 50,
    cell: ({ row }) => {
      return (
        <TableAction
          url={apiRoutes.discount}
          ShowPreview
          id={row.original?.id}
        />
      );
    },
  },
];
