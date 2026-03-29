import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { apiRoutes } from "@/service/apiRoutes";

import { useClientById, useClientMutation } from "./actions";
import FormContent from "./content";
import { ClientFormType, ClientSchema } from "./schema";
import { useMeStore } from "@/store/me-store";

const ActionPage = () => {
  const {meUser}= useMeStore()
  const form = useForm<ClientFormType>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      filialId: meUser?.filial?.id,
      userId: meUser?.id
    },
  });
  const [id, setId] = useQueryState("id");
  const { data } = useClientById({
    id: id != "new" ? id || undefined : undefined,
  });
 
  const queryClient = useQueryClient();
  const resetFrom = () => {
    form.reset({
      comment:undefined,
      fullName: undefined,
      phone:undefined,
      userId:undefined,
      filialId:undefined,
    })
  };
  const { mutate } = useClientMutation({
    onSuccess: () => {
      resetFrom();
      setId(null);
      queryClient.invalidateQueries({ queryKey: [apiRoutes.clients] });
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
        filialId:meUser?.filial?.id,
        comment:data?.comment,
        fullName: data?.fullName,
        userId: meUser?.id,
        phone:data?.phone
      })
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
