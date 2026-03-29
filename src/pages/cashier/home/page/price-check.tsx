import { useQuery } from "@tanstack/react-query";

import CheckList from "@/components/check";
import { Button } from "@/components/ui/button";
import { getByIdData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";

import { IData } from "../type";
import AddingParishOrFlow from "@/components/adding-parish-flow";
import { useMeStore } from "@/store/me-store";
import { IOpenKassa } from "@/types/api-type";

export default function Pricecheck({ selected }: { selected: IData[] }) {
  const price = selected?.reduce((a, b) => a + b.plasticSum + b.price, 0);
  const discountSum = selected?.reduce((a, b) => a + b.discountSum, 0);
  // const queryClient = useQueryClient();
  const { meUser } = useMeStore();
  const filialId = meUser?.filial.id;
  // const AccepedFunt = () => {
  //   UpdatePatchData(apiRoutes.order + "/accept", "", {
  //     ids: selected?.map((e) => e.id),
  //   })
  //     .then(() => {
  //       toast.success("Подтверждено успешно");
  //       queryClient.invalidateQueries({ queryKey: [apiRoutes.orderByKassa] });
  //     })
  //     .catch(() => toast.error("что-то пошло не так"));
  // };

  const { data } = useQuery({
    queryKey: [apiRoutes.filial, filialId],
    queryFn: () =>
      getByIdData<IOpenKassa, void>("/kassa/open-kassa", filialId || ""),
    enabled: !!filialId,
  });

  return (
    <div className="w-full max-w-[312px]  pt-[23px] ">
      <AddingParishOrFlow kassaId={String(data?.id)} />
      <div className="w-full px-5">
        <div className="sticky mb-2.5 mt-4 top-0">
          <p className="text-primary text-[14px] font-medium  ml-2">Итого:</p>
          <p className="text-primary font-bold text-[28px] mt-0.5 mb-[27px] ml-2">
            {price} $
          </p>
          <div className="bg-card flex items-center  rounded-xl text-primary justify-between px-[13px] py-[14px] mb-[1px]">
            <p className="text-[14px] font-semibold ">Cкидка:</p>
            <p className="text-[22px] font-semibold">- {discountSum}$</p>
          </div>
        </div>

        <CheckList
          price={price}
          discountSum={discountSum}
          selected={selected}
        />
           <Button
          // onClick={AccepedFunt}
          // disabled
          className="w-full rounded-xl h-[50px] bg-card  hover:bg-card mb-2 mt-auto text-primary text-[16px] font-semibold "
        >
          Распечатать чек
        </Button>
      </div>
     
    </div>
  );
}
