import { DialogTitle } from "@radix-ui/react-dialog";
import { Copy } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import FormDatePicker from "@/components/forms/FormDateRangePicker";
import FormTextInput from "@/components/forms/FormTextInput";
import FormTimePicker from "@/components/forms/FormTimePicker";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { UploadAvatarButton } from "@/components/UploadCloud";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";

export default function FormContent() {
  const { watch, setValue } = useFormContext();
  const generateLoginId = () => {
    api
      .get(apiRoutes.userLoginGenerate)
      .then((res) => setValue("login", String(res.data)));
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(watch("login"));
      toast.success("Скопировано");
    } catch (err) {
      toast.error(String(err));
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Добавления сотрудника</DialogTitle>
      </DialogHeader>
      <div className="grid px-14 py-8 row-start   mb-2 gap-4 lg:grid-cols-3">
        <FormTextInput
          label="Имя"
          className="w-full"
          name="firstName"
          placeholder="Имя"
        />
        <FormTextInput
          label="Фамилия"
          className="w-full"
          name="lastName"
          placeholder="Фамилия"
        />
        <FormTextInput
          label="Отчество"
          className="w-full"
          name="fatherName"
          placeholder="Отчество"
        />
        <FormDatePicker
          label="Дата приёма"
          className="w-full"
          name="hired"
          placeholder="Дата приёма"
        />
        <div className="flex w-full overflow-hidden items-end">
          <FormTimePicker
            label="Время работы"
            className="w-1/2"
            name="from"
            placeholder="От"
          />
          <FormTimePicker className="w-1/2" name="to" placeholder="До" />
        </div>
        <FormTextInput
          label="Номер телефона"
          className="w-full"
          name="phone"
          placeholder="Номер телефона"
        />

        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/filial"
          name="filial"
          placeholder="Укажите Филиал"
          label="Филиал"
        />
        <FormTextInput
          type="number"
          label="Зарплата"
          name="salary"
          placeholder="0.00"
        />
        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          name="bonus"
          option={[]}
          disabled={true}
          placeholder="Нет бонусов"
          label="Бонус"
        />

        <FormComboboxDemoInput
          fieldNames={{ value: "id", label: "title" }}
          fetchUrl="/position"
          name="position"
          placeholder="Укажите должность"
          label="Должность"
        />
        <div className="relative col-span-2">
          <FormTextInput
            label="Генерация id для входа"
            className="w-full"
            name="login"
            placeholder="# id"
          />
          <div className="absolute right-1 bottom-0.5 flex gap-2 items-center">
            <Copy
              onClick={() => copyToClipboard()}
              width={16}
              height={16}
              color="#5D5D53"
            />
            <Button onClick={() => generateLoginId()} type="button">
              Сгенерировать
            </Button>
          </div>
        </div>
        <div>
          <p className="text-[#5D5D53] font-medium text-sm my-4">
            Файлы сторудника
          </p>
          <UploadAvatarButton />
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
