import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { apiRoutes } from "@/service/apiRoutes";

import { useUserById, useUserMutation } from "./actions";
import FormContent from "./content";
import { UserFormType, UserSchema } from "./schema";

const ActionPage = () => {
  const form = useForm<UserFormType>({
    resolver: zodResolver(UserSchema),
  });
  const [id, setId] = useQueryState("id");
  const { data } = useUserById({
    id: id != "new" ? id || undefined : undefined,
  });
  const queryClient = useQueryClient();
  const resetFrom = () => {
    form.reset({
      filial: {
        value: undefined,
        label: undefined,
      },
      firstName: undefined,
      avatar: {
        id: undefined,
        path: undefined,
      },
      lastName: undefined,
      fatherName: undefined,
      hired: undefined,
      position: {
        value: undefined,
        label: undefined,
      },
      from: undefined,
      to: undefined,
      phone: undefined,
      login: undefined,
      salary: undefined,
    });
  };
  const { mutate } = useUserMutation({
    onSuccess: () => {
      resetFrom();
      setId(null);
      queryClient.invalidateQueries({ queryKey: [apiRoutes.user] });
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
        filial: {
          value: data?.filial?.id,
          label: data?.filial?.title,
        },
        firstName: data?.firstName,
        avatar: data?.avatar,
        lastName: data?.lastName,
        fatherName: data?.fatherName,
        hired: new Date(data?.hired || ""),
        position: {
          value: data?.position?.id,
          label: data?.position?.title,
        },
        from: data?.from?.slice(0, 5),
        to: data?.to?.slice(0, 5),
        phone: data?.phone,
        login: data?.login,
        salary: data?.salary,
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
      <DialogContent className="sm:max-w-[796px] max-h-[80vh] overflow-y-auto">
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
