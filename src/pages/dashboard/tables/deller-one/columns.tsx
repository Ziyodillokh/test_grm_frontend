import { TransferCollectionDealerData } from "@/pages/reports/d-manager/transfer/type";
import { ColumnDef } from "@tanstack/react-table";

export const collactionColumns: ColumnDef<TransferCollectionDealerData>[] = [
 
  {
    header: "Название",
    id: "title",
    accessorKey: "title",
  },

  {
    header: "count",
    id: "total_count",
    accessorKey: "total_count",
    cell: ({ row }) => {
      return <p className="py-4">{row.original?.total_count}  шт</p>;
    },
  },

  {
    header: "Обёm",
    id: "total_kv",
    cell: ({ row }) => {
      return <p>{Number(row.original?.total_kv).toFixed(2)} м²</p>;
    },
  },
  {
    header: "Сумма",
    cell: ({ row }) => {
   
      return (
        <>
          <p>{(Number(row?.original?.comingPrice) * Number(row.original?.total_kv)).toFixed(1)}$</p>
        </>
      );
    },
  },
  {
    header: "Нavar",
    id: "total_profit_sum",
    cell: ({ row }) => {
      return <p>{Number(row.original?.total_profit_sum).toFixed(2)} $</p>;
    },
  },
];