import { useNavigate, useParams } from "react-router-dom";

import SearchInput from "@/components/filters-ui/search-input";
import { BrCodeIcons } from "@/components/icons";
import { Button } from "@/components/ui/button";


import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";
import { orderProduct } from "../type";
import FilterComboboxDemoInput from "@/components/filters-ui/filterCombobox";
import { useState } from "react";
import { TSelectOption } from "@/types";

interface FiltersProps {
  seleted: orderProduct[]; // yoki TransferItem[] bo‘lishi mumkin, aniqlashtirsang yaxshi bo'ladi
}
const Filter: React.FC<FiltersProps> = ({ seleted }) => {
  const navigate = useNavigate();
  const { id, uuid } = useParams();
  const [courier, setCourier] = useState<TSelectOption | undefined>();

  const sendTransfer = async () => {
    const body = {
      to: uuid,
      from: id,
      courier: courier?.value,
    };
    await api.post(apiRoutes.transferBasket, body);
    navigate("/transfers");
  };
  const sendOrderTransfer = async () => {
    await api.post(apiRoutes.orderBusketMultiple, seleted);
  };
  return (
    <div className="bg-sidebar grid grid-cols-2  border-border border-b     ">
      <div className=" ">
        <div className="w-full flex h-[64px]  border-border border-solid border-b border-r p-[22px] ">
          <h4 className="text-[14px] font-semibold text-foreground">
            Продукты Филиала
          </h4>
        </div>
        <div className="h-[35px] pl-[15px] border-r flex justify-between">
          <div className="flex">
            <Button className="h-full border-l-1  justify-center gap-1  border-y-0  border-r-0">
              <BrCodeIcons color="white" />
              Баркод
            </Button>

            <SearchInput className="border-l-1 border " />
          </div>

          <Button
            onClick={() => sendOrderTransfer()}
            className="h-full border-l-1  justify-center gap-1  border-y-0  border-r-0"
          >
            Трансфер
          </Button>
        </div>
      </div>

      <div className="pr-[15px]">
        <div className="w-full flex h-[64px]  border-border border-solid border-b p-[22px] ">
          <h4 className="text-[14px] font-semibold text-foreground">
            Продукты трансфера для филиала
          </h4>
        </div>
        <div className="h-[35px]  border-r flex justify-between">
          <div className="flex">
            <SearchInput className="border-l-1 border-b-0 border ml-auto  min-w-[150px]" />
            <FilterComboboxDemoInput
              queries={{
                filial: uuid,
              }}
              className="max-w-[100px]"
              placeholder="Курьер"
              fieldNames={{ label: "firstName", value: "id" }}
              setValue={setCourier}
              value={courier || null}
              fetchUrl="user"
              name="courier"
            />
          </div>

          <Button
            onClick={() => sendTransfer()}
            className="h-full border-l-1  justify-center gap-1  border-y-0  border-r-0"
          >
            Отправить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
