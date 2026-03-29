import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { apiRoutes } from "@/service/apiRoutes";

import { usePayrollItemById, usePayrollItemMutation } from "./actions";
import FormContent from "./content";
import { PayrollItemFormType, PayrollItemSchema } from "./schema";
import { useQueryClient } from "@tanstack/react-query";

const ActionPage = ({month}:{month:string}) => {
  const form = useForm<PayrollItemFormType>({
    resolver: zodResolver(PayrollItemSchema)
  });
  const [id, setId] = useQueryState("id");
  const { data } = usePayrollItemById({
    id: id != "new" ? id || undefined : undefined,
  });
 
  const queryClient = useQueryClient();
  const resetFrom = () => {
    form.reset({
      selectedMonth:+month,
    })
  };
  const { mutate } = usePayrollItemMutation({
    onSuccess: () => {
      resetFrom();
      setId(null);
      queryClient.invalidateQueries({ queryKey: [apiRoutes.payrollItems] });
      if (id == "new") {
        toast.success("savedSuccessfully");
      } else {
        toast.success("updatedSuccessfully");
      }
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        plastic: data?.plastic,
        in_hand: data?.in_hand,
        prepayment: data?.prepayment,
        payrollId:  data?.payroll?.id,
        userId: data?.user?.id,
        salary: data?.user?.salary,
        awardId: data?.award?.id,
        bonusId: data?.bonus?.id,
        is_premium: data?.is_premium,
        is_bonus: data?.is_bonus,
        selectedMonth:+month,
      })
    }
  }, [data]);

  useEffect(()=>{
    if(!form.watch('is_bonus')) form.setValue('bonusId',undefined)
  },[form.watch('is_bonus')])

  useEffect(()=>{
    if(!form.watch('is_premium')) form.setValue('awardId',undefined)
  },[form.watch('is_premium')])

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(isopen: boolean) => {
        resetFrom();
        if (!isopen) {
          setId(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-[568px]">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              mutate({
                data: data,
                id: id !== "new" ? id || undefined : undefined,
              });
            })}
          >
            <FormContent  data={data}/>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ActionPage;
