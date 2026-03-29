import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


import FormComboboxDemoInput from "@/components/forms/FormCombobox";
import { AddData } from "@/service/apiHelpers";
import { toast } from "sonner";
import { apiRoutes } from "@/service/apiRoutes";
import { useQueryClient } from "@tanstack/react-query";
interface AddEmployeeModalProps {
  isOpen: boolean;
  month: string;
  onClose: () => void;
  statementId: string;
  selectedFilialId?: string;
}

const formSchema = z.object({
  selectedMonth:z.string().optional(),
  employeeId:  z.object({
    value: z.string(),
    label: z.string()
  }),
  filial: z.object({
    value: z.string(),
    label: z.string()
  }),
  enableBonus: z.boolean().default(false),
  enablePremium: z.boolean().default(true),
  salary: z.number().default(0),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddEmployeeModal({
  isOpen,
  onClose,
  month,
  statementId,
}: AddEmployeeModalProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema )
  });

  const selectedFilial = form.watch("filial");

  const  CloseFunc = ()=>{
    form.reset({
      salary:undefined,
      selectedMonth:undefined,
      employeeId:undefined,
      filial:undefined,
      enableBonus:undefined,
      enablePremium:undefined,
    })
    onClose()
  }

  const onSubmit = async (data: FormValues) => {
    try {
   
      await AddData("/payroll-items", {
        selectedMonth: month,
        plastic: 0,
        in_hand: data?.salary,
        prepayment: 0,
        payrollId: statementId,
        userId: data?.employeeId?.value,
        is_premium: false,
        is_bonus: false
      });
      // payrollItems
      queryClient.invalidateQueries({ queryKey: [apiRoutes.payrollItems] });
      toast.success("Сотрудник успешно добавлен");
      CloseFunc();
    } catch (error) {
      toast.error("Ошибка при добавлении сотрудника");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={CloseFunc}>
      <DialogContent className="sm:max-w-[796px] p-0 bg-card">
        <DialogHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-medium">
              Добавить сотрудника
            </DialogTitle>
          </div>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <div className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[14px] font-medium">
                    Данные о ведомости
                  </h3>

                  <div className="flex gap-4">
                      <FormComboboxDemoInput
                        fieldNames={{ value: "id", label: "title" }}
                        fetchUrl="/filial"
                        className="w-1/3"
                        classNameChild="h-[40px] p-2"
                        name="filial"
                        placeholder="Укажите флиал"
                        label="Флиал"
                      />
                   <FormComboboxDemoInput
                        fieldNames={{ value: "id", label: "firstName" }}
                        fetchUrl={`/user` }
                        className="w-2/3"
                        classNameChild="h-[40px]  p-2"
                        name="employeeId"
                        disabled={!selectedFilial?.value}
                        queries={{filial: selectedFilial?.value}}
                        placeholder="Выберите сотрудников"
                        label="Сотрдуник"
                      />
                  </div>

               
                </div>
              </div>
            </div>

            <div className="flex border-t p-2 bg-[#E6E6D9]">
              <Button
                type="submit"
                className="rounded-none h-12 w-[220px] mx-3"
              >
                Сохранить
              </Button>
              <Button
                type="button"
                className="rounded-none h-12 w-[220px] border-l bg-card"
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