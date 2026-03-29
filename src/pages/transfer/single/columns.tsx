import { ColumnDef } from "@tanstack/react-table";

import { ProductData, ProductDataOrder } from "@/pages/filial/type";
import { MinusSquare, PlusSquare } from "lucide-react";

export const Columns: ColumnDef<ProductData>[] = [
  {
    header: "№",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },

  {
    header: "collection",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.collection?.title}</p>;
    },
  },

  {
    header: "model",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.model?.title}</p>;
    },
  },
  {
    header: "size",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.size?.title}</p>;
    },
  },

  {
    header: "Обём",
    cell: ({ row }) => {
      return (
        <p>
          {(
            Number(row.original?.bar_code?.size?.x) *
            Number(row.original?.bar_code?.size?.y)
          ).toFixed(2)}
          м²
        </p>
      );
    },
  },
  {
    header: "color",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.color?.title}</p>;
    },
  },

  {
    header: "country",
    cell: ({ row }) => {
      return <p>{row.original?.bar_code?.country?.title}</p>;
    },
  },
  {
    header: "count",
    cell: ({ row }) => {
      return <p>{row.original?.count}x</p>;
    },
  },
];

export const TransferColumns :ColumnDef<ProductDataOrder>[]  = [
  {
    header: "№",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },

  {
    header: "collection",
    cell: ({ row }) => {
      return <p>{row.original?.product?.bar_code?.collection?.title}</p>;
    },
  },

  {
    header: "model",
    cell: ({ row }) => {
      return <p>{row.original?.product?.bar_code?.model?.title}</p>;
    },
  },
  {
    header: "size",
    cell: ({ row }) => {
      return <p>{row.original?.product?.bar_code?.size?.title}</p>;
    },
  },

  {
    header: "Обём",
    cell: ({ row }) => {
      return (
        <p>
          {(
            Number(row.original?.product?.bar_code?.size?.x) *
            Number(row.original?.product?.bar_code?.size?.y)
          ).toFixed(2)}
          м²
        </p>
      );
    },
  },
  {
    header: "color",
    cell: ({ row }) => {
      return <p>{row.original?.product?.bar_code?.color?.title}</p>;
    },
  },

  {
    header: "country",
    cell: ({ row }) => {
      return <p>{row.original?.product?.bar_code?.country?.title}</p>;
    },
  },
  {
    header: "count",
    cell: ({ row }) => {
      return (
        <>
          {row.original?.product?.bar_code?.isMetric ? (
            <input
              type="number"
              min={0}
              max={row.original?.product?.y}
              value={row.original?.product?.quantity}
              className="w-16 h-4 border rounded p-2.5 outline-none"
              // onChange={(e) => {
              //   const value = Number(e.target.value);
              //   setTransferData((prevData) => {
              //     return prevData.map((item) => {
              //       if (item.id === row.original.id) {
              //         return { ...item, quantity: value };
              //       } else return item;
              //     });
              //   });
              // }}
            />
          ) : (
            <div className="flex items-center">
              <button
                disabled={row.original?.product?.quantity === 1}
                // onClick={() => {
                //   setTransferData((prevData) => {
                //     return prevData.map((item) => {
                //       if (item.id === row.original.id) {
                //         return {
                //           ...item,
                //           quantity: row.original.quantity - 1,
                //         };
                //       } else return item;
                //     });
                //   });
                // }}
              >
                <MinusSquare color="#21212180" />
              </button>

              <p className="  rounded font-medium w-8 h-[22px] flex justify-center items-center text-center border border-[#21212180] ">
                {row.original?.product?.quantity}
              </p>
              <button
                // disabled={
                //   row.original.count <=
                //   (transferData?.find((i) => i?.id === row.original.id)
                //     ?.quantity ?? 0)
                // }
                // onClick={() => {
                //   setTransferData((prevData) => {
                //     return prevData.map((item) => {
                //       if (item.id === row.original.id) {
                //         return {
                //           ...item,
                //           quantity: row.original.quantity + 1,
                //         };
                //       } else return item;
                //     });
                //   });
                // }}
              >
                <PlusSquare color="#21212180" />
              </button>
            </div>
          )}
        </>
      );
    },
  },
];
