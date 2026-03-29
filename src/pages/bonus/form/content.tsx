import { DialogTitle } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FormTextInput from "@/components/forms/FormTextInput";
import FormSelectInput from "@/components/forms/FormSelect";
import FormDatePicker from "@/components/forms/FormDateRangePicker";

const operatorArr = [
  {
    label: "= Равно",
    value: "=",
  },
  {
    label: ">= Больше и Равно",
    value: ">=",
  },
  {
    label: "> Больше",
    value: ">",
  },
];


const conditionUnitArr = [
  {
    label: "шт",
    value: "шт",
  },
  {
    label: "м²",
    value: "м²",
  },
];

const bonusUnitArr = [
  {
    label: "$",
    value: "$",
  },
  {
    label: "%",
    value: "%",
  },
];

export default function FormContent() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Добавления бонуса</DialogTitle>
      </DialogHeader>
      <div className="grid px-14 py-8 row-start mb-2 gap-2 lg:grid-cols-3">
        <p className="mb-[12px] col-span-3 w-full">
          Введите условия и сумма премье
        </p>
        <FormTextInput
          label="Название бонуса"
          className="w-full  col-span-3"
          name="title"
          placeholder="Название бонуса"
        />

        <div className="w-full relative">
          <FormTextInput
            label="Условия"
            type="number"
            className="w-full"
            name="condition"
            placeholder="Условия"
          />
          <FormSelectInput
            classNameChild="bg-white"
            className="w-[68px] h-[34px]  mt-6 absolute right-[2px] top-0"
            placeholder="шт"
            name="conditionUnit"
            option={conditionUnitArr}
          />
        </div>

        <FormSelectInput
          label="Выберите опреатора"
          className="w-full"
          placeholder="Выберите опреатора"
          name="operator"
          option={operatorArr}
        />

        <div className="w-full relative">
          <FormTextInput
            label="Бонус"
            type="number"
            className="w-full"
            name="bonusAmount"
            placeholder="Бонус"
          />
          <FormSelectInput
            classNameChild="bg-white"
            className="w-[68px] h-[34px]  mt-6 absolute right-[2px] top-0"
            placeholder="$"
            name="bonusUnit"
            option={bonusUnitArr}
          />
        </div>

        <p className="mb-[12px] mt-[30px] col-span-3 w-full">Дата окончание</p>
        <FormDatePicker
          label="Дата окончание бонуса"
          className="w-full"
          name="endDate"
        />
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
