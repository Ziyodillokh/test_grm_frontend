import { DialogTitle } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FormTextInput from "@/components/forms/FormTextInput";
import FormTextArea from "@/components/forms/FormTextArea";

export default function FormContent() {

  return (
    <>
      <DialogHeader>
        <DialogTitle>Добавления Кленть</DialogTitle>
      </DialogHeader>
      <div className="grid px-14 py-8 row-start   mb-2 gap-2 lg:grid-cols-2">
        <FormTextInput
          label="Имя Фамилия"
          className="w-full"
          name="fullName"
          placeholder="Имя Фамилия"
        />
    
        <FormTextInput
          label="Номер телефона"
          className="w-full"
          name="phone"
          placeholder="Номер телефона"
        />

        <FormTextArea
          label="Комментария"
          className="w-full"
          name="comment"
          
          placeholder="Комментария"
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
