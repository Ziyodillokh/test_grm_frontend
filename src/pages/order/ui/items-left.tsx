import { Calendar, Clock } from "lucide-react";
import OrderTableWrapper from "./order-table-wrapper";
import { TData, IOrderItem } from "../type";

export default function ItemsLeft({ data, items }: { data?: TData; items?: IOrderItem[] }) {
  return (
    <div className="w-full max-w-[275px]">
      <OrderTableWrapper className="mb-[10px]" title="Тулов малумолтари (Чек)">
        <div className="border-border bg-card border-[1px] border-solid  m-[6px] p-4">
          <div className="flex items-center justify-between ">
            <p className="text-[12px] leading-[14px] text-[#6F6F63]">Сайт:</p>
            <p className="text-[12px] leading-[14px] text-[#212121] font-medium text-end">
              www.gilam-market.uz
            </p>
          </div>
          <div className="flex items-center  justify-between mt-[4px] mb-[11px]">
            <p className="text-[12px] leading-[14px] text-[#6F6F63]">Заказ:</p>
            <p className="text-[12px] leading-[14px] text-[#212121] font-medium text-end">
              №{data?.sequence} {data?.date}
            </p>
          </div>
          <ul className="border-border w-full border-t border-dotted py-3">
            <li className="w-full flex items-center gap-1 mb-[10px]">
              <p className="text-[12px] min-w-[73px] leading-[14px] text-[#6F6F63] w-full">
                Заказы
              </p>
              <p className="text-[12px] leading-[14px] text-[#6F6F63] w-full">
                Размер
              </p>
              <p className="text-[12px] leading-[14px] text-center text-[#6F6F63] w-full">
                Кол-во
              </p>
              <p className="text-[12px] leading-[14px] text-end text-[#6F6F63] w-full">
                Сумма
              </p>
            </li>
            {items?.map((item) => (
              <li key={item.id} className="w-full flex items-center gap-1 mb-2">
                <p className="text-[12px] min-w-[73px] leading-[14px] text-[#212121] w-full font-medium truncate">
                  {item.product?.collection?.title || "-"}
                </p>
                <p className="text-[12px] leading-[14px] text-[#212121] w-full font-medium">
                  {item.product?.size?.title || "-"}
                </p>
                <p className="text-[12px] leading-[14px] text-center text-[#212121] w-full font-medium">
                  {item.count}x
                </p>
                <p className="text-[12px] leading-[14px] text-end text-[#212121] w-full font-medium">
                  {(Number(item.price) * item.count).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>

          <ul className="border-border w-full border-t border-dotted py-3">
            <li className="w-full flex items-center gap-1 mb-[10px]">
              <p className="text-[12px] leading-[14px] text-[#6F6F63] w-full">
                Итого
              </p>
              <p className="text-[12px] leading-[14px] w-[80px] text-end text-[#6F6F63] ">
                {data?.totalPrice?.toLocaleString()}
              </p>
            </li>
            <li className="w-full flex items-center mb-1 gap-1">
              <p className="text-[12px] leading-[14px] flex items-center gap-1 text-[#212121] w-full font-medium">
                <span className="font-normal w-full">Статус оплаты:</span>
                <span className="w-full"> {data?.payment_status}</span>
              </p>

              <p className="text-[12px] leading-[14px] w-[80px] text-[#212121] text-end font-medium">
                {data?.pre_payment?.toLocaleString()}
              </p>
            </li>
            <li className="w-full flex items-center mb-1s gap-1">
              <p className="text-[12px] leading-[14px] flex items-center gap-1 text-[#212121] w-full font-medium">
                <span className="font-normal w-full">Тип оплаты:</span>
                <span className="w-full"> {data?.payment_type}</span>
              </p>

              <p className="text-[12px] leading-[14px] w-[80px] text-[#212121] text-end font-medium">

              </p>
            </li>
          </ul>
        </div>
        <p className="text-[12px] py-[10px] flex items-center gap-1 justify-center leading-[14px] text-[#212121] font-medium">
          Скачать чек
        </p>
      </OrderTableWrapper>

      <OrderTableWrapper title="Доставка">
        <p className="text-[12px] p-3 pb-2 leading-[14px] mb-2 text-[#6F6F63]">
          Адресс доставки
        </p>
        <div className="row-start w-full grid grid-cols-2 gap-[5px] px-3 mb-3 ">
          <p className="p-[9px]  text-[12px]  px-[11px] border-border border rounded-md">
            {data?.city || "-"}
          </p>
          <p className="p-[9px]  text-[12px]  px-[11px]   border-border border rounded-md">
            {data?.district || "-"}
          </p>
          <p className="p-[9px] col-span-2 text-[12px]  px-[11px] w-full  border-border border rounded-md">
            {data?.full_address || "-"}
          </p>
        </div>
        <p className="text-[12px] p-3  pb-2 leading-[14px]  text-[#6F6F63]">
          Комментария для курьера
        </p>
        <div className="px-3">
          <p className="p-[9px] text-[12px] px-[11px] w-full border-border border rounded-md">
            {data?.delivery_comment || "-"}
          </p>
        </div>
        <p className="text-[12px] p-3 pb-2 leading-[14px]  text-[#6F6F63]">
          Дата доставки:
        </p>
        <div className="px-3 pb-3 gap-1 grid row-start w-full  grid-cols-3">
          <p className="p-[9px] flex  items-center gap-1 text-[12px] col-span-2 px-[11px] w-full border-border border rounded-md">
            <Calendar className="w-[10px]" /> {data?.startDate ? new Date(data.startDate).toLocaleDateString() : "-"}
          </p>
          <p className="p-[9px] text-nowrap flex items-center gap-1  text-[12px] px-[11px] w-full border-border border rounded-md">
            <Clock className="w-[10px]" /> {data?.startDate ? new Date(data.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
          </p>
        </div>
      </OrderTableWrapper>
    </div>
  );
}
