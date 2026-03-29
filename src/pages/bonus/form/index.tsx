import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { apiRoutes } from "@/service/apiRoutes";

import { useBonusById, useBonusMutation } from "./actions";
import FormContent from "./content";
import { BonusFormType, BonusSchema } from "./schema";

const ActionPage = () => {
  const form = useForm<BonusFormType>({
    resolver: zodResolver(BonusSchema),
    defaultValues: {
      bonusUnit: "$",
      conditionUnit: "шт",
    },
  });
  const [id, setId] = useQueryState("id");
  const { data } = useBonusById({
    id: id != "new" ? id || undefined : undefined,
  });

  const queryClient = useQueryClient();
  const resetFrom = () => {
    form.reset({
      title: undefined,
      condition: undefined,
      conditionUnit: "шт",
      operator: undefined,
      bonusAmount: undefined,
      bonusUnit: "$",
      endDate: undefined,
    });
  };
  const { mutate } = useBonusMutation({
    onSuccess: () => {
      resetFrom();
      setId(null);
      queryClient.invalidateQueries({ queryKey: [apiRoutes.bonus] });
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
        title: data?.title,
        condition: data?.condition,
        conditionUnit: data?.conditionUnit,
        operator: data?.operator,
        bonusAmount: data?.bonusAmount,
        bonusUnit: data?.bonusUnit,
        endDate: data?.endDate,
      });
    }
  }, [data]);
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
      <DialogContent className="sm:max-w-[796px]">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              mutate({
                data: data,
                id: id !== "new" ? id || undefined : undefined,
              });
            })}
          >
            <FormContent />
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ActionPage;
