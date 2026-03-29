import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { apiRoutes } from "@/service/apiRoutes";

import { useAwardsById, useAwardsMutation } from "./actions";
import FormContent from "./content";
import { AwardsFormType, AwardsSchema } from "./schema";

const ActionPage = () => {
  const form = useForm<AwardsFormType>({
    resolver: zodResolver(AwardsSchema),
   
  });
  const [id, setId] = useQueryState("id");
  const { data } = useAwardsById({
    id: id != "new" ? id || undefined : undefined,
  });

  const queryClient = useQueryClient();
  const resetFrom = () => {
    form.reset({
      title: undefined,
      sum: undefined,
    });
  };
  const { mutate } = useAwardsMutation({
    onSuccess: () => {
      resetFrom();
      setId(null);
      queryClient.invalidateQueries({ queryKey: [apiRoutes.awards] });
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
        sum: data?.sum,
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
