import { DialogTitle } from "@radix-ui/react-dialog";
import { useQueryState } from "nuqs";

import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import FormDatePicker from "@/components/forms/FormDateRangePicker";
import FormTextInput from "@/components/forms/FormTextInput";
import { Button } from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useFormContext } from "react-hook-form";
import { Loader } from "lucide-react";

export default function FormContent({isPending}:{isPending:boolean}) {
  const [id, setId] = useQueryState("id");
  const form = useFormContext();
  const warehouse = form.watch("warehouse");

  // const handleSubmit = async () => {
  //   const data = {
  //     country: country.value,
  //     factory: factory.value,
  //     partiya_no: partiya_no.value,
  //     warehouse: warehouse.value,
  //     user: user.value,
  //     expense,
  //     date: date,
  //     volume,
  //   };
  //   await api.post(apiRoutes.parties, data);
  //   if (id == "new") {
  //     toast.success("savedSuccessfully");
  //   } else {
  //     toast.success("updatedSuccessfully");
  //   }
  //   await queryClient.invalidateQueries({ queryKey: ["clients"] });
  //   queryClient.invalidateQueries({ queryKey: [apiRoutes.parties] });
  //   setId(null);
  // };


  return (
    <>
      <DialogHeader>
        <DialogTitle>Создание новой партии</DialogTitle>
      </DialogHeader>

      <div className="mx-15 my-8">
        <h3 className="text-foreground text-[17px] font-medium">
          Данные о партии и поставщике
        </h3>
        <p className="mt-0.5 text-foreground/45 text-[12px] mb-4">
          Укажите данные о партии: откуда она поступила, какой поставщик и к
          какой партии за этот год она относится.
        </p>

        <div className="flex gap-2">
          <FormComboboxDemoInput
            fieldNames={{ value: "id", label: "title" }}
            fetchUrl="/country"
            name="country"
            placeholder="country"
            disabled={id != "new"}
            label="country"
          />
          <FormComboboxDemoInput
            fieldNames={{ value: "id", label: "title" }}
            fetchUrl="/factory"
            name="factory"
            placeholder="factory"
            label="factory"
            disabled={id != "new"}
          />
          <FormComboboxDemoInput
            fieldNames={{ value: "id", label: "title" }}
            fetchUrl="/partiya-number"
            name="partiya_no"
            placeholder="Партия"
            label="Партия"
            disabled={id != "new"}
          />
        </div>

        <h3 className="text-foreground mt-[30px] text-[17px] font-medium">
          Данные о получении и расходе партии
        </h3>
        <p className="mt-0.5 text-foreground/45 text-[12px] mb-4">
          Укажите дату получения партии, её объём и общий расход, а также
          итоговое количество.
        </p>

        <div className="flex gap-2">
          <FormTextInput
            name="expense"
            placeholder="Введите расход в $"
            label="Расход"
            type="number"
          />
          <FormTextInput
            name="volume"
            placeholder="Введите обём в м²"
            type="number"
            label="Обём"
          />
          <FormDatePicker
            name="date"
            label="Дата создания партии"
            placeholder="12 янв 2025"
          />
        </div>

        <h3 className="text-foreground text-[17px] font-medium mt-8">
          Оприходование партии на склад.
        </h3>
        <p className="mt-0.5 text-foreground/45 text-[12px] mb-4">
          Укажите, какой склад будет принимать эту партию и кто за это будет
          отвечать.
        </p>

        <div className="flex gap-2">
          <FormComboboxDemoInput
            fieldNames={{ value: "id", label: "title" }}
            fetchUrl="/filial"
            onLocalChange={() => {
              form.setValue("user", null);
            }}
            queries={{ type: "warehouse" }}
            name="warehouse"
            placeholder="Укажите склад"
            label="Склад"
          />
          <FormComboboxDemoInput
            fetchUrl={`/user/managers/${warehouse?.value}`}
            fieldNames={{ value: "id", label: "firstName" }}
            name="user"
            disabled={!warehouse}
            placeholder="Ответсвенный лицо"
            label="Ответсвенный лицо"
          />
        </div>
      </div>

      <DialogFooter className="justify-start">
        <Button disabled={isPending} type="submit">   {isPending ? <Loader className="animate-spin"/>: ""} Сохранить</Button>
        <Button variant="outline" type="button" onClick={() => setId(null)}>
          Отменить
        </Button>
      </DialogFooter>
    </>
  );
}
