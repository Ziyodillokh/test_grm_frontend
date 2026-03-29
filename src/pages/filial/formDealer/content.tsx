import { DialogTitle } from "@radix-ui/react-dialog";
import { Copy } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import FormTextInput from "@/components/forms/FormTextInput";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";
import { useMeStore } from "@/store/me-store";

export default function FormContent() {
  const { meUser } = useMeStore();
  const { setValue, watch } = useFormContext();
  const generateLoginId = () => {
    api
      .get(apiRoutes.userLoginGenerate)
      .then((res) => setValue("login", String(res.data)));
  };
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
      <DialogHeader className=" ">
        <DialogTitle className="text-[18px]">
          {meUser?.position.role === 6 ? "Дилер" : "Филиал"}
        </DialogTitle>
      </DialogHeader>
      <div className="grid row-start px-14 py-8   gap-4 grid-cols-3">
        <p className="col-span-3 text-[#5D5D53] font-medium text-[14px] text-left">
          Данные
        </p>
        <FormTextInput
          label={
            meUser?.position.role === 6
              ? "Название дилера"
              : "Официальное название"
          }
          className={` ${meUser?.position.role !== 6 ? "w-full" : "col-span-2"}`}
          name="title"
          placeholder={
            meUser?.position.role === 6
              ? "Название дилера"
              : "Официальное название"
          }
        />
        <FormTextInput
          label="Номер телефона"
          className="w-full"
          name="phone1"
          placeholder="Номер телефона"
        />
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

        <FormTextInput
          label="Адресс"
          className={` ${meUser?.position.role !== 6 ? "w-full" : "col-span-2"}`}
          name="address"
          placeholder="Адресс"
        />

        <p className="col-span-3 mt-8 text-[#5D5D53] font-medium text-[14px] text-left">
          Доступ в систему
        </p>
        <FormTextInput
          readOnly
          label="Должность"
          className="w-full"
          name="position"
          placeholder="Менеджер"
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
      </div>
      <DialogFooter className="!justify-start !flex  !flex-row  ">
        <Button type="submit" className="w-[220px] h-[44px]">
          Создать
        </Button>
        <Button
          variant={"outline"}
          type="button"
          className="w-[220px] h-[44px]"
        >
          Отменить
        </Button>
      </DialogFooter>
    </>
  );
}
