import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { apiRoutes } from "@/service/apiRoutes";

import { useDealerMutation, useFilialById } from "./actions";
import FormContent from "./content";
import { FilialFormType, FilialSchema } from "./schema";

const ActionPageDealer = () => {
  const pathName = useLocation();

  const form = useForm<FilialFormType>({
    resolver: zodResolver(FilialSchema),
    defaultValues: {
      type: pathName.pathname.split("/")[1],
    },
  });
  const [id, setId] = useQueryState("id");
  const { data } = useFilialById({
    id: id != "new" ? id || undefined : undefined,
  });
  const queryClient = useQueryClient();
  const resetFrom = () => {
    form.reset({
      title: "",
      address: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      login: "",
      phone1: "",
      type: "dealer",
    });
  };
  const { mutate } = useDealerMutation({
    onSuccess: () => {
      resetFrom();
      setId(null);
      queryClient.invalidateQueries({ queryKey: [apiRoutes.filial] });
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
        title: data?.title || "",
        address: data?.address || "",
        phone1: data?.phone1 || "",
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        fatherName: data?.lastName || "",
        login: data?.login || "",
        type: "dealer",
      });
    }
  }, [data]);

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(isopen: boolean) => {
        if (!isopen) {
          setId(null);
          resetFrom();
        }
      }}
    >
      <DialogContent className="sm:max-w-[796px] bg-card">
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

export default ActionPageDealer;
