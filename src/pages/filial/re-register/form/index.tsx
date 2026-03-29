import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useProdcutCheck, useBarCodeById } from "./actions";
import FormContent from "./content";
import { CropFormType, CropSchema } from "./schema";
import { useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import { parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import { useMeStore } from "@/store/me-store";

const ActionPageQrCode = () => {
  const { meUser } = useMeStore();
  const { filialId } = useParams();
  const form = useForm<CropFormType>({
    resolver: zodResolver(CropSchema),
    defaultValues: {
      // filialReportId: filialReportId || "",
      filialId: filialId == "my-filial" ? meUser?.filial?.id || "" : filialId || "",
    },
  });

  const [tip] = useQueryState(
    "tip",
    parseAsString.withDefault(
      meUser?.position?.role == 7 || meUser?.position.role == 4
        ? "переучет"
        : "new"
    )
  );

  const [barcode, setBarcode] = useQueryState("barcode");
  const [productId] = useQueryState("productId");
  const resetForm = () => {
    form.reset({
      code: "",
      isMetric: {
        value: "",
        label: "",
      },
      value: "" as unknown as number,
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
  };

  useEffect(() => {
    if (barcode && barcode !== "new") {
      form.setValue("code", barcode);
    }
    if (barcode == "new") {
      resetForm();
    }
  }, [barcode]);

  useEffect(() => {
    resetForm();
    setBarcode("new");
  }, [tip]);

  const brcode = useDebounce(form.watch("code"), 500);

  const { data: qrBaseOne } = useBarCodeById({
    id: brcode || undefined,
  });
  const queryClient = useQueryClient();

  const { mutate } = useProdcutCheck({
    onSuccess: () => {
      resetForm();
      const codeInput = document.querySelector('input[name="code"]');
      if (codeInput) {
        (codeInput as HTMLInputElement).select();
      }
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reInventoryGetByFilialReport] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.reInventoryGetByFilialReportTotals] });
      queryClient.invalidateQueries({
        queryKey: [apiRoutes.excelProductsReport],
      });

      toast.success("Продукт добавлено успешно");
    },
  });

  useEffect(() => {
    if (qrBaseOne) {
      form.reset({
        code: qrBaseOne?.code || "",
        isMetric: {
          value: qrBaseOne?.isMetric ? "true" : "false",
          label: qrBaseOne?.isMetric ? "Метражный" : "Штучный",
        },
        value: "" as unknown as number,
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
          mutate({
            id: productId || "",
            isUpdate: barcode == "new" || barcode == undefined ? false : true,
            data: {
              // filialReportId: filialReportId || "",
              filialId: filialId == "my-filial" ? meUser?.filial?.id || "" : filialId || "",
              ...data,
            },
          });
        })}
      >
        <FormContent />
      </form>
    </FormProvider>
  );
};

export default ActionPageQrCode;
