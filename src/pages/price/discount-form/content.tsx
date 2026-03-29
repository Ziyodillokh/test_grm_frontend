import { DialogTitle } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FormTextInput from "@/components/forms/FormTextInput";

export default function FormContent() {

  return (
    <>
      <DialogHeader>
        <DialogTitle>Добавления Скидки</DialogTitle>
      </DialogHeader>
      <div className="grid px-14 py-8 row-start   mb-2 gap-2 lg:grid-cols-2">
        <FormTextInput
          label="Название"
          className="w-full"
          name="title"
          placeholder="Название"
        />

        <FormTextInput
          label="Скидка(%)"
          className="w-full"
          type="number"
          name="discountPercentage"
          placeholder="Скидка"
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
