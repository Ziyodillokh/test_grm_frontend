import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { apiRoutes } from "@/service/apiRoutes";

import { useDataLibrary, useDataLibraryId } from "./actions";
import FormContent from "./content";
import { CropFormType, CropSchema } from "./schema";

const ActionPageQrCode = () => {
  const form = useForm<CropFormType>({
    resolver: zodResolver(CropSchema),
    defaultValues: {
      country: {
        value: undefined,
        label: "",
      },
      collection: {
        value: undefined,
        label: "",
      },
      size: {
        value: undefined,
        label: "",
      },
      shape: {
        value: undefined,
        label: "",
      },
      style: {
        value: undefined,
        label: "",
      },
      
      color: {
        value: undefined,
        label: "",
      },
      model: {
        value: undefined,
        label: "",
      },
      factory: {
        value: undefined,
        label: "",
      },
    },
  });
  const [id, setId] = useQueryState("id");
  const [barcode] = useQueryState("barcode");
  const { data } = useDataLibraryId({
    id: id != "new" ? id || undefined : undefined,
  });
  const queryClient = useQueryClient();
  const ResetFormFuct = () => {
    form.reset({
      code: "",
      country: {
        value: undefined,
        label: "",
      },
      collection: {
        value: undefined,
        label: "",
      },
      size: {
        value: undefined,
        label: "",
      },
      shape: {
        value: undefined,
        label: "",
      },
      style: {
        value: undefined,
        label: "",
      },
      color: {
        value: undefined,
        label: "",
      },
      model: {
        value: undefined,
        label: "",
      },
      factory: {
        value: undefined,
        label: "",
      },
    });
  };
  const { mutate } = useDataLibrary({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.qrBase] });
      const codeInput = document.querySelector('input[name="code"]');
      if (codeInput) {
        (codeInput as HTMLInputElement).select();
      }
      setId("new");
      if (id == "new") {
        toast.success("savedSuccessfully");
        ResetFormFuct();
      } else {
        toast.success("updatedSuccessfully");
      }
    },
  });


  useEffect(() => {
    if (data) {
      form.reset({
        code: data?.code || "",
        country: {
          value: data?.country?.id,
          label: data?.country?.title,
        },
        factory:{
          value: data?.factory?.id,
          label: data?.factory?.title,
        },
        collection: {
          value: data?.collection?.id,
          label: data?.collection?.title,
        },
        size: {
          value: data?.size?.id,
          label: data?.size?.title,
        },
        shape: {
          value: data?.shape?.id,
          label: data?.shape?.title,
        },
        style: {
          value: data?.style?.id,
          label: data?.style?.title,
        },
        color: {
          value: data?.color?.id,
          label: data?.color?.title,
        },
        isMetric: {
          value: data?.isMetric ? "true" : "false",
          label: data?.isMetric ? "Метражный" : "Штучный",
        },
        model: {
          value: data?.model?.id,
          label: data?.model?.title,
        },
       
      });
    }
  }, [data]);

  useEffect(() => {
    form.setValue("code", barcode || "");
  }, [barcode]);

  useEffect(() => {
    if (id == "new") {
      ResetFormFuct();
    }
  }, [id]);

  return (
    <FormProvider {...form}>
      <form
        className="w-1/3  h-full"
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
  );
};

export default ActionPageQrCode;
