import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

import CarpetCashierCard from "@/components/cards/carpet-cashier-card";
import { minio_img_url } from "@/constants";

import { IData } from "../type";
import Pricecheck from "./price-check";
import { LoaderIcon } from "lucide-react";

export default function Content({ orderList, isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage,
 }: {
     orderList: IData[],
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
   }) {
  const [selected, setSelected] = useState<IData[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!fetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex">
        <div className="my-[13px] w-full h-[calc(100vh-135px)]  scrollCastom ml-[10px] mr-[20px]">
          {orderList &&
            orderList?.map((item, index) => {
              return (
                <CarpetCashierCard
                  key={index}
                  index={index}
                  className="mb-2.5"
                  onCheckedChange={(e) => {
                    setSelected((prev) => {
                      if (e) {
                        return [...prev, item];
                      } else {
                        return prev.filter((e) => e.id !== item.id);
                      }
                    });
                  }}
                  tags={[
                    item?.product?.bar_code?.isMetric ? "Метражный" : "Штучный",
                    item?.product?.bar_code?.shape?.title,
                    item?.product?.bar_code?.style?.title,
                    item?.product?.bar_code?.color?.title,
                    item?.product?.bar_code?.country?.title,
                    item?.product?.partiya_title,
                  ]}
                  comment={item?.comment}
                  discount={
                    item?.discountSum === null
                      ? "~"
                      : `-${item?.discountSum}$`
                  }
                  id={item?.id}
                  img={
                    item?.product?.bar_code?.imgUrl
                      ? minio_img_url + item?.product?.bar_code?.imgUrl?.path
                      : "/images/default.svg"
                  }
                  model={item?.product?.bar_code?.model?.title}
                  size={item?.product?.bar_code?.size?.title}
                  count={item?.x + "x"}
                  status={item?.status}
                  seller={item?.seller}
                  price={(item?.price || 0) + "$"}
                  plasticSum={
                    item?.plasticSum ? (item?.plasticSum || 0) + "$" : "0$"
                  }
                  isDebt={item?.isDebt}
                  priceMitr={
                    (item?.product?.bar_code?.collection?.collection_prices?.[0]
                      ?.priceMeter || 0) + "$"
                  }
                  colaction={item?.product?.bar_code?.collection?.title}
                  color="Beige"
                  date={format(item.date, "yyyy-MM-dd HH:MM")}
                />
              );
            })}
        {fetchNextPage && (
            <div
              ref={loadMoreRef}
              className="flex justify-center items-center "
            >
              {isFetchingNextPage ? (
                <LoaderIcon/>
              ) : hasNextPage ? (
                <div className="h-8" />
              ) : (
                  <div className="text-sm text-muted-foreground"></div>
              )}
            </div>
          )}
        </div>
      <Pricecheck selected={selected} />
    </div>
  );
}
