import { ChevronLeft, Loader2 } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Dispatch, SetStateAction } from "react";

import { usePlanSellersFetch } from "./queries";
import TebleAvatar from "@/components/teble-avatar";

interface IPlanSellersProps {
    filialId: string | null;
    setFilialId: Dispatch<SetStateAction<{ id: string; title: string } | null>>;
    year?: string | number | null;
    filialName?: string | null;
}

export default function PlanSellers({
    filialId,
    setFilialId,
    year,
    filialName
}: IPlanSellersProps) {
    const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
    const [page] = useQueryState("page", parseAsInteger.withDefault(1));

    const [monthPlanFilials] = useQueryState("monthPlanFilials");
    const { data, isLoading, fetchNextPage, hasNextPage } = usePlanSellersFetch({
        filialId,
        year,
        queries: {
            page,
            limit,
            month: monthPlanFilials || undefined
        }
    });

    const sellers = data?.pages?.flatMap((page) => page?.items || []) || [];

    return (
        <>
            <div className="flex gap-1 px-5 my-4">
                <div
                    onClick={() => setFilialId(null)}
                    className="bg-primary cursor-pointer p-5 w-[120px] rounded-2xl flex items-center gap-2 text-white"
                >
                    <ChevronLeft />
                    <p>назад</p>
                </div>
                <div className="bg-card px-5 rounded-2xl flex items-center justify-center font-bold text-lg min-w-[200px]">
                    {filialName}
                </div>
            </div>

            <div className="px-5 bg-card flex flex-col gap-4 py-4 h-[calc(100vh-200px)] overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : (
                    sellers.length === 0 ? (
                        <p className="text-center text-gray-500">Empty List</p>
                    ) : (
                        <>
                            {sellers.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center border-b border-border pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-2">
                                        <TebleAvatar status={"none"} name={item?.firstName} url={item?.avatar?.path} />

                                        <h4 className="font-semibold text-xl">
                                            {item?.firstName} {item?.lastName}
                                        </h4>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <div className="text-lg">
                                            <span className="text-gray-500">Планка:</span>{" "}
                                            <span className="font-bold">
                                                {new Intl.NumberFormat("ru-RU")
                                                    .format(Number(item?.plan_price || 0))
                                                    .replace(/,/g, " ")}{" "}
                                                $
                                            </span>
                                        </div>
                                        <div className="text-lg">
                                            <span className="text-gray-500">Сделано :</span>{" "}
                                            <span className="font-bold text-[#89A143]">
                                                {new Intl.NumberFormat("ru-RU")
                                                    .format(Number(item?.earn || 0))
                                                    .replace(/,/g, " ")}{" "}
                                                $
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div
                                ref={(ref) => {
                                    if (ref) {
                                        const observer = new IntersectionObserver(
                                            (entries) => {
                                                if (entries[0].isIntersecting && hasNextPage) {
                                                    fetchNextPage();
                                                }
                                            },
                                            { threshold: 1 }
                                        );
                                        observer.observe(ref);
                                        return () => observer.disconnect();
                                    }
                                }}
                                className="h-10 w-full"
                            />
                        </>
                    )
                )}
            </div>
        </>
    );
}
