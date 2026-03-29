import { DialogTitle } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FormTextInput from "@/components/forms/FormTextInput";
import { StatementItem } from "../../type";
import TebleAvatar from "@/components/teble-avatar";
import FormSwitch from "@/components/forms/FormSwitch";
import FormSelectInput from "@/components/forms/FormSelect";
import { useFormContext } from "react-hook-form";


export default function FormContent({
  data,
}: {
  data: StatementItem | undefined;
}) {
  const { watch } = useFormContext();



  return (
    <>
      <DialogHeader>
        <DialogTitle>Изменить данные о ведомости</DialogTitle>
      </DialogHeader>
      <div className="grid px-14 py-8 row-start   mb-2 gap-2 lg:grid-cols-2">
        <div className="col-span-2 flex items-center gap-2.5">
          <TebleAvatar
            status="none"
            name={data?.user?.firstName || ""}
            url={data?.user?.avatar?.path}
          />
          <div className="w-full">
            <p className="mb-[2px] text-[13px] font-medium text-primary">
              {data?.user?.firstName} {data?.user?.lastName}
            </p>
            <p className="mb-[2px] text-[14px] font-medium text-primary">
              <span className="text-[#99998C] mr-1">Итого:</span> {data?.total}$
            </p>
          </div>
        </div>
        <FormTextInput
          label="Зарплата"
          type="number"
          className="w-full"
          name="salary"
          disabled
          placeholder="Зарплата"
        />

        <FormTextInput
          label="Аванс"
          type="number"
          className="w-full"
          name="prepayment"
          placeholder="Аванс"
        />

        <FormTextInput
          label="Пластик"
          type="number"
          className="w-full"
          name="plastic"
          placeholder="Пластик"
        />

        <FormTextInput
          label="Наличные"
          type="number"
          className="w-full"
          name="in_hand"
          placeholder="Наличные"
        />

        <div className="flex items-center col-span-2 gap-5 w-full mt-[30px]">
          <FormSwitch className="w-1/3" label="Бонуса" name="is_bonus" />
          <FormSelectInput
            fetchUrl="/bonus"
            name="bonusId"
            disabled={!watch("is_bonus")}
            fieldNames={{label:"title",value:"id"}}
            className="w-2/3"
            placeholder="Выберите бонус"
          />
        </div>
        <div className="flex items-center col-span-2 mt-[20px] gap-5 w-full ">
          <FormSwitch className="w-1/3" label="Премии" name="is_premium" />
          <FormSelectInput
            fetchUrl="/awards"
            name="awardId"
            disabled={!watch("is_premium")}
            fieldNames={{label:"title",value:"id"}}
            className="w-2/3"
            placeholder="Выберите Премии"
          />
        </div>
      </div>

      <DialogFooter className="!justify-start mt-2 flex">
        <Button type="submit" className="w-[220px] h-[44px]">
          Сохранить
        </Button>
        <Button
          variant={"outline"}
          type="button"
          className="bg-white w-[220px] h-[44px]"
        >
          Отменить
        </Button>
      </DialogFooter>
    </>
  );
}
