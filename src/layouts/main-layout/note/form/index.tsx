import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { apiRoutes } from "@/service/apiRoutes";

import { useDataAdd, useDataId } from "./actions";
import FormContent from "./content";
import { DataSchema, FormDataType } from "./schema";

const ActionPage = () => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(DataSchema),
  });
  const [id, setId] = useQueryState("id");

  const { data: OneData } = useDataId({
    id: id == "new" ? undefined : id || undefined,
  });
  const queryClient = useQueryClient();

  const { mutate } = useDataAdd({
    onSuccess: () => {
      form.reset({
        color: "none",
        title: "",
      });
      setId(null);
      queryClient.invalidateQueries({ queryKey: [apiRoutes.notes] });
      toast.success("добавлено успешно!");
    },
  });

  useEffect(() => {
    if (OneData) {
      form.reset({
        color: OneData?.color || "none",
        title: OneData?.title || "",
      });
    }
  }, [OneData]);

  return (
    <FormProvider {...form}>
      <form
        className="w-full h-full mb-4 relative"
        onSubmit={form.handleSubmit((data) => {
          mutate(data);
        })}
      >
        <FormContent />
      </form>
    </FormProvider>
  );
};

export default ActionPage;
