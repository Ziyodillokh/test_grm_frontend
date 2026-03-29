import { ColumnDef } from "@tanstack/react-table";


import { TData } from "../type";



import ShadcnSelect from "@/components/Select";
import { useUpdateOrder } from "./queries";
import { OrderStatusEnum, PaymentStatusEnum } from "../type";

const PaymentStatusCell = ({ row }: { row: any }) => {
  const { mutate, isPending } = useUpdateOrder();

  const options = [
    { label: "Оплачено", value: PaymentStatusEnum.PAID },
    { label: "Не оплачено", value: PaymentStatusEnum.UNPAID },
  ];

  const getColor = (status: string) => {
    switch (status) {
      case PaymentStatusEnum.PAID:
        return "bg-[#ECFDF3] text-[#027A48]";
      case PaymentStatusEnum.UNPAID:
        return "bg-[#FEF3F2] text-[#B42318]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-[140px]">
      <ShadcnSelect
        value={row.original.payment_status}
        onChange={(val) => {
          if (val) {
            mutate({ id: row.original.id, data: { payment_status: val } });
          }
        }}
        options={options}
        disabled={isPending}
        placeholder="Выберите статус"
        className={`h-8 border-none ${getColor(row.original.payment_status)}`}
        classNameValue="text-current"
      />
    </div>
  );
};

const OrderStatusCell = ({ row }: { row: any }) => {
  const { mutate, isPending } = useUpdateOrder();

  const options = Object.values(OrderStatusEnum).map((status) => ({
    label: status,
    value: status,
  }));

  const getColor = (status: string) => {
    switch (status) {
      case OrderStatusEnum.NEW:
        return "bg-[#EFF8FF] text-[#175CD3]";
      case OrderStatusEnum.IN_PROCESS:
        return "bg-[#FFFAEB] text-[#B54708]";
      case OrderStatusEnum.DONE:
        return "bg-[#ECFDF3] text-[#027A48]";
      case OrderStatusEnum.CANCELLED:
        return "bg-[#FEF3F2] text-[#B42318]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-[140px]">
      <ShadcnSelect
        value={row.original.order_status}
        onChange={(val) => {
          if (val) {
            mutate({ id: row.original.id, data: { order_status: val } });
          }
        }}
        options={options}
        disabled={isPending}
        placeholder="Выберите статус"
        className={`h-8 border-none ${getColor(row.original.order_status)}`}
        classNameValue="text-current"
      />
    </div>
  );
};

export const FilialColumns: ColumnDef<TData>[] = [
  {
    header: "№",
    cell: ({ row }) => {
      return <p>{row?.index + 1}</p>;
    },
  },
  {
    id: "buyer",
    header: "Покупатель",
    accessorKey: "user.firstName",
    cell: ({ row }) => {
      return <p>{row.original.user?.firstName} {row.original.user?.lastName}</p>;
    },
  },

  {
    id: "phone",
    header: "Номер",
    accessorKey: "user.phone",
    cell: ({ row }) => {
      return <p>{row.original.user?.phone}</p>;
    },
  },
  {
    id: "totalPrice",
    header: "Стоимость заказа",
    accessorKey: "totalPrice",
    cell: ({ row }) => {
      return <p className="text-[#E38157]">{row.original.totalPrice?.toLocaleString()} сум</p>;
    },
  },
  {
    id: "payment_type",
    header: "Тип оплаты",
    accessorKey: "payment_type",
    cell: ({ row }) => {
      return <p className="text-[#58A0C6]">{row.original.payment_type}</p>;
    },
  },
  {
    id: "payment_status",
    header: "Статус оплаты",
    accessorKey: "payment_status",
    cell: ({ row }) => <PaymentStatusCell row={row} />,
  },
  {
    id: "pre_payment",
    header: "Оплачено",
    accessorKey: "pre_payment",
    cell: ({ row }) => {
      return <p >{row.original.pre_payment} сум</p>;
    },
  },
  {
    id: "promo",
    header: "Промокод",
    cell: () => {
      return <p >нет</p>;
    },
  },
  {
    id: "discount",
    header: "Скидка",
    cell: () => {
      return <p className="text-[#F05B58]">0 сум</p>;
    },
  },
  {
    id: "order_status",
    header: "Статус заказа",
    accessorKey: "order_status",
    cell: ({ row }) => <OrderStatusCell row={row} />,
  },

  {
    id: "date",
    header: "Время",
    accessorKey: "date",
    cell: ({ row }) => <p>{row.original.date}</p>
  },

  // {
  //   id: "actions",
  //   enableHiding: true,
  //   header: () => <div className="text-right">{"actions"}</div>,
  //   size: 50,
  //   cell: ({ row }) => {
  //     return (
  //       <TableAction
  //         url={apiRoutes.filial}
  //         ShowPreview
  //         id={row.original?.id}
  //       >
  //       </TableAction>
  //     );
  //   },
  // },
];
