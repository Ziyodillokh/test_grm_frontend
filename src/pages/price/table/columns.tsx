import { ColumnDef } from "@tanstack/react-table";
import { useQueryState } from "nuqs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";
import debounce from "@/utils/debounce";

import useDiscountDataFetch from "../discount-table/queries";
import { ProductsData } from "../type";
import { ChevronDown } from "lucide-react";


export const getColumns = (role?: number): ColumnDef<ProductsData>[] => [
  {
    header: "Коллекция",
    cell: ({ row }) => {
      return <p>{row.original?.title}</p>;
    },
  },

  {
    header: "Обём",
    cell: ({ row }) => {
      return (
        <p>
          {row.original?.totalKv}
          м²
        </p>
      );
    },
  },
  {
    header: "Акция",
    cell: () => {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger disabled asChild>
              <p className="p-1  opacity-50 px-2.5 flex justify-between items-center text-primary font-medium text-[14px] border border-border rounded-[5px]">
                Акция
                {/* <ChevronDown width={20} /> */}
              </p>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center">
              <DropdownMenuItem>1 шт 400x300+1 Afra</DropdownMenuItem>
              <DropdownMenuItem>1+Joy namoz</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
        // <p className="p-1  px-2.5 text-primary font-medium text-[14px] border border-border rounded-[5px]">
        //   Акция
        // </p>
      );
    },
  },
  {
    header: "Бонусы",
    cell: () => {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger disabled asChild>
              <p className="p-1   opacity-50 px-2.5 flex justify-between items-center text-primary font-medium text-[14px] border border-border rounded-[5px]">
                Бонусы
                {/* <ChevronDown width={20} /> */}
              </p>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center">
              <DropdownMenuItem>12 шт</DropdownMenuItem>
              <DropdownMenuItem>20 шт</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
        // <p className="p-1  px-2.5 text-primary font-medium text-[14px] border border-border rounded-[5px]">
        //   Бонусы
        // </p>
      );
    },
  },
  {
    header: "Промокоды",
    cell: () => {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger disabled asChild>
              <p className="p-1    opacity-50 px-2.5 flex justify-between items-center text-primary font-medium text-[14px] border border-border rounded-[5px]">
                Промокоды
                {/* <ChevronDown width={20} /> */}
              </p>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center">
              <DropdownMenuItem>i98349d4</DropdownMenuItem>
              <DropdownMenuItem>i98349d4</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
        // <p className="p-1  px-2.5 text-primary font-medium text-[14px] border border-border rounded-[5px]">
        //   Промокоды
        // </p>
      );
    },
  },
  {
    header: "Скидка",
    cell: () => {
      const { data } = useDiscountDataFetch({
        queries: { page: 1, limit: 100 },
      });
      const discounts = data?.pages.flatMap((page) => page?.items) || [];

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <p className="p-1 px-2.5 flex justify-between items-center text-primary font-medium text-[14px] border border-border rounded-[5px]">
              Скидка <ChevronDown width={20} />
            </p>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center">
            <DropdownMenuItem key="noDiscount" >Без скидки</DropdownMenuItem>
            {discounts?.map((item) => (
              <DropdownMenuItem key={item?.id} >
                {item?.title}  <p className="text-[#E38157]">(-{item?.discountPercentage}%)</p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    header: role === 8 ? "Касса нархи" : "Зав-цена за м²",
    cell: ({ row }) => {
      const [editId] = useQueryState("editId");
      const changePrices = (val: number, id: string) => {
        const body = [
          {
            comingPrice: val,
            collectionId: id,
          },
        ];
        api.post(apiRoutes.collectionMultiple, body);
      };

      return (
        <div className="relative max-w-[90px]">
          <Input
            disabled={editId != row?.original?.id}
            className={`border-border bg-card border rounded-[5px] `}
            defaultValue={row?.original?.collection_prices?.[0]?.comingPrice}
            placeholder="0"
            type="number"
            onChange={debounce((e) => {
              const val = Number(e.target.value); // konvert qilish muhim
              changePrices(val, row.original.id);
            }, 800)}
          />
          <p className="absolute right-2 top-3 ">$</p>
        </div>
      );
    },
  },
  {
    header: "Цена за м²",
    cell: ({ row }) => {
      const [editId] = useQueryState("editId");
      const changePrices = (val: { val: number }, id: string) => {
        const body = [
          {
            priceMeter: Number(val),
            collectionId: id,
          },
        ];
        api.post(apiRoutes.collectionMultiple, body);
      };
      return (
        <div className="relative max-w-[90px]">
          <Input
            disabled={editId != row?.original?.id}
            className={`border-border bg-card border rounded-[5px] `}
            defaultValue={row?.original?.collection_prices?.[0]?.priceMeter}
            placeholder="0"
            type="number"
            onChange={debounce((e) => {
              changePrices(e.target.value, row.original.id);
            }, 800)}
          />
          <p className="absolute right-2 top-3 ">$</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "actions",
    size: 50,
    cell: ({ row }) => {
      const [editId, seEditId] = useQueryState("editId");
      return (
        <p onClick={() => seEditId(editId == row?.original?.id ? null : row?.original?.id)} className={`${editId == row?.original?.id ? "bg-primary text-background" : "bg-background "}  inline-block  py-[6px]  text-[12px] px-[10px] rounded-[4px]`}>
          {editId == row?.original?.id ? "сохранить" : "изменить"}
        </p>
      )
    }
  },
];
