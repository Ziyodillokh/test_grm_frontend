import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useProdcutCheck, useBarCodeById } from "./actions";
import FormContent from "./content";
import { CropFormType, CropSchema } from "./schema";
import { useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import { parseAsBoolean, useQueryState } from "nuqs";

const ActionPageQrCode = () => {
  const form = useForm<CropFormType>({
    resolver: zodResolver(CropSchema),
    defaultValues: {
      country: {
        value: undefined,
        label: "",
      },
      factory: {
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
    },
  });
  const [id, setId] = useQueryState("id");
  const [auto, setAuto] = useQueryState("auto", parseAsBoolean);

  const brcode = form.watch("code");

  const { data: qrBaseOne } = useBarCodeById({
    id: brcode || undefined,
  });
  const queryClient = useQueryClient();

  const { mutate } = useProdcutCheck({
    onSuccess: () => {
      form.reset({
        code: "",
        isMetric: "",
        count: undefined,
        country: {
          value: "",
          label: "",
        },
        collection: {
          value: "",
          label: "",
        },
        size: {
          value: "",
          label: "",
        },
        shape: {
          value: "",
          label: "",
        },
        style: {
          value: "",
          label: "",
        },
        color: {
          value: "",
          label: "",
        },
        model: {
          value: "",
          label: "",
        },
      });
      const codeInput = document.querySelector('input[name="code"]');
      if (codeInput) {
        (codeInput as HTMLInputElement).select();
      }
      queryClient.invalidateQueries({ queryKey: [apiRoutes.productReport] });
      if (id == "new") {
        setId("new");
        toast.success("Продукт добавлено успешно");
      } else {
        toast.success("Продукт добавлено успешно");
      }
    },
  });
  useEffect(() => {
    if (qrBaseOne) {
      if (qrBaseOne?.isMetric) {
        setAuto(false);
      }
      form.reset({
        code: qrBaseOne?.code || "",
        isMetric: qrBaseOne?.isMetric ? "Метражный" : "Штучный",
        count: qrBaseOne?.count || qrBaseOne?.isMetric ? undefined : 1,
        country: {
          value: qrBaseOne?.country?.id,
          label: qrBaseOne?.country?.title,
        },
        collection: {
          value: qrBaseOne?.collection?.id,
          label: qrBaseOne?.collection?.title,
        },
        size: {
          value: qrBaseOne?.size?.id,
          label: qrBaseOne?.size?.title,
        },
        shape: {
          value: qrBaseOne?.shape?.id,
          label: qrBaseOne?.shape?.title,
        },
        style: {
          value: qrBaseOne?.style?.id,
          label: qrBaseOne?.style?.title,
        },
        color: {
          value: qrBaseOne?.color?.id,
          label: qrBaseOne?.color?.title,
        },
        model: {
          value: qrBaseOne?.model?.id,
          label: qrBaseOne?.model?.title,
        },
        factory: {
          value: qrBaseOne?.factory?.id,
          label: qrBaseOne?.factory?.title,
        },
      });
      if (auto && !qrBaseOne?.isMetric) {
        mutate({
          data: { bar_code: qrBaseOne?.id || "", y: qrBaseOne?.count || 1 },
        });
      }
    }
  }, [qrBaseOne]);

  return (
    <FormProvider {...form}>
      <form
        className="w-1/3 h-full"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        onSubmit={form.handleSubmit((data) => {
          mutate({ data: { bar_code: qrBaseOne?.id || "", y: data?.count } });
        })}
      >
        <FormContent />
      </form>
    </FormProvider>
  );
};

export default ActionPageQrCode;
