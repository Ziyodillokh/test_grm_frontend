import { DialogTitle } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FormTextInput from "@/components/forms/FormTextInput";

export default function FormContent() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Добавления премье</DialogTitle>
      </DialogHeader>
      <div className="grid px-14 py-8 row-start mb-2 gap-2 lg:grid-cols-3">
        <p className="mb-[12px] col-span-3 w-full">
          Введите условия и сумма премье
        </p>
        <FormTextInput
          label="Название"
          className="w-full  col-span-2"
          name="title"
          placeholder="Название"
        />
        <FormTextInput
          label="Сумма"
          type="number"
          className="w-full"
          name="sum"
          placeholder="Сумма"
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
