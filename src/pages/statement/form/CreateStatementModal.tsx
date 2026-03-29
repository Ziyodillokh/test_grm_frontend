import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiRoutes } from "@/service/apiRoutes";
import api from "@/service/fetchInstance";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { useStatementsId } from "../table/queries";
import FormSelectInput from "@/components/forms/FormSelect";
import FormTextInput from "@/components/forms/FormTextInput";
const monthsArray = [
  { label: "Январь", value: "1" },
  { label: "Февраль", value: "2" },
  { label: "Март", value: "3" },
  { label: "Апрель", value: "4" },
  { label: "Май", value: "5" },
  { label: "Июнь", value: "6" },
  { label: "Июль", value: "7" },
  { label: "Август", value: "8" },
  { label: "Сентябрь", value: "9" },
  { label: "Октябрь", value: "10" },
  { label: "Ноябрь", value: "11" },
  { label: "Декабрь", value: "12" }
]
interface CreateStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  month: z.string().min(1, "Месяц обязательно"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateStatementModal({
  isOpen,
  onClose,
}: CreateStatementModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const [id, setId] = useQueryState("id");

  const queryClient = useQueryClient();
  const { t } = useTranslation();

const {data,isLoading:dataLoading} = useStatementsId({id: id  === "new"? undefined : id ||undefined})

  const CloseFunc = ()=>{
    form.reset({
      title: "",
    })
    onClose();
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const body = {
        title: data.title,
        month: +data?.month || undefined,
      };
      if(id=="new"){
        await api.post(apiRoutes.payrolls, body);
      } else {
        await api.patch(apiRoutes.payrolls+ "/"+id, body);
      }

      setId(null);
      queryClient.invalidateQueries({ queryKey: [apiRoutes.payrolls] });
      toast.success(id === "new" ? t("savedSuccessfully") : t("updatedSuccessfully"));
      CloseFunc()
     
    } catch (error) {
      toast.error("Ошибка при сохранении");
    } finally {
      setIsLoading(false);
    }
  };
useEffect(()=>{
  form.reset({
    title: data?.title || undefined,
    month: data?.month || undefined,
  })
},[data,id])

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={CloseFunc}>
      <DialogContent className="sm:max-w-[568px] p-0 bg-card">
        <DialogHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-medium">
              Создания ведомость
            </DialogTitle>
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="py-[32px] px-13">
              <div className="space-y-4">
                <Label htmlFor="number">Данные о ведомости</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                     <FormTextInput
                      name="number"
                      label="Название"
                      className="w-[100px]"
                       placeholder='№---'
                    />
                  <FormSelectInput
                    label="За какой месяц"
                    name="month"
                    className="max-w-[350px]"
                    option={monthsArray}
                    />
                    <FormTextInput
                      name="title"
                      label="Название"
                      placeholder="Введите название"
                    />
                </div>
              </div>
            </div>

            {/* Footer with buttons */}
            <div className="flex justify-start border-t p-3 bg-[#E6E6D9]">
              <Button
                type="submit"
                disabled={isLoading || dataLoading}
                className="rounded-none w-[220px] mx-3 h-[44px] bg-[#5D5D53]"
              >
                {isLoading || dataLoading  ? "Сохранение..." : "Сохранить"}
              </Button>
              <Button
                type="button"
                disabled={isLoading}
                className="rounded-none w-[220px] h-[44px] bg-card border"
                variant="outline"
                onClick={CloseFunc}
              >
                Отменить
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}