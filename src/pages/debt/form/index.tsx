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

const ActionPage = () => {
  const form = useForm<ClientFormType>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      given: 0,
      owed: 0
    },
  });
  const [id, setId] = useQueryState("id");
  const { data } = useClientById({
    id: id != "new" ? id || undefined : undefined,
  });
 
  const queryClient = useQueryClient();
  const resetFrom = () => {
    form.reset({
      fullName: undefined,
      phone:undefined,
      owed: 0,
      given:0,
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
        fullName: data?.fullName,
        phone:data?.phone,
        owed:data?.owed,
        given:data?.given,
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
