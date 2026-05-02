import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useProdcutCheck, useBarCodeById } from "./actions";
import FormContent from "./content";
import { CropFormType, CropSchema } from "./schema";
import { useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import { useMeStore } from "@/store/me-store";
import { useEditPartiyaProductStore } from "@/store/edit-partiya-product-store";

const ActionPageQrCode = () => {
  const { meUser } = useMeStore();
  // Mount paytida store'dan o'qiymiz — komponent har row tahrirlash uchun key
  // bilan remount bo'ladi, shuning uchun bu doim joriy product
  const initialEditProduct = useEditPartiyaProductStore.getState().product;
  const initialTip =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("tip")
      : null;

  const buildInitial = () => {
    if (!initialEditProduct) {
      return {
        country: { value: undefined, label: "" },
        factory: { value: undefined, label: "" },
        collection: { value: undefined, label: "" },
        size: { value: undefined, label: "" },
        shape: { value: undefined, label: "" },
        style: { value: undefined, label: "" },
        color: { value: undefined, label: "" },
        model: { value: undefined, label: "" },
      } as any;
    }
    const bc = initialEditProduct?.bar_code;
    const computedCount = bc?.isMetric
      ? (initialEditProduct?.y || 0) * 100
      : initialTip === "recount"
      ? initialEditProduct?.check_count || 0
      : initialEditProduct?.count || 0;
    return {
      code: bc?.code || "",
      isMetric: bc?.isMetric ? "Metrli" : "Donabay",
      count: computedCount,
      country: { value: bc?.country?.id || "", label: bc?.country?.title || "" },
      collection: { value: bc?.collection?.id || "", label: bc?.collection?.title || "" },
      size: { value: bc?.size?.id || "", label: bc?.size?.title || "" },
      shape: { value: bc?.shape?.id || "", label: bc?.shape?.title || "" },
      style: { value: bc?.style?.id || "", label: bc?.style?.title || "" },
      color: { value: bc?.color?.id || "", label: bc?.color?.title || "" },
      model: { value: bc?.model?.id || "", label: bc?.model?.title || "" },
      factory: {
        value: initialEditProduct?.factory?.id || "",
        label: initialEditProduct?.factory?.title || "",
      },
    } as any;
  };

  const form = useForm<CropFormType>({
    resolver: zodResolver(CropSchema),
    defaultValues: buildInitial(),
  });

  const [count, setCount] = useQueryState(
    "count",
    parseAsInteger.withDefault(0)
  );
  const [tip] = useQueryState(
    "tip",
    parseAsString.withDefault((meUser?.position?.role == 7 || meUser?.position.role == 4) ? "recount" : "new")
  );
  const [idLoc, setId] = useQueryState("id");
  const { id } = useParams();
  const [barcode, setBarcode] = useQueryState("barcode");
  const [productId] = useQueryState("productId");
  // const [auto, setAuto] = useQueryState("auto", parseAsBoolean);
  const resetForm = () => {
    form.reset({
      code: "",
      isMetric: "",
      count: 0,
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

  // Tip o'zgarganda formni reset qilamiz, lekin INITIAL mount paytida emas
  // (mount paytida row click bilan kelgan ma'lumotlarni o'chirib qo'ymaslik uchun)
  const tipFirstRun = useRef(true);
  useEffect(() => {
    if (tipFirstRun.current) {
      tipFirstRun.current = false;
      return;
    }
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
      queryClient.invalidateQueries({ queryKey: [apiRoutes.excelProducts] });
      queryClient.invalidateQueries({
        queryKey: [apiRoutes.excelProductsReport],
      });

      if (idLoc == "new") {
        setId("new");
        toast.success("Продукт добавлено успешно");
      } else {
        toast.success("Продукт добавлено успешно");
      }
    },
  });
  useEffect(() => {
    if (barcode == "new" || barcode == undefined) {
      setCount(
        qrBaseOne?.count || qrBaseOne?.isMetric
          ? (qrBaseOne?.size?.y || 0) * 100
          : 1
      );
    }
  }, [qrBaseOne, barcode]);

  // Tahrirlash bossa store'dagi product orqali to'g'ridan-to'g'ri formni to'ldiramiz
  // (qrBase fetch'iga umid qilmaymiz, chunki ba'zi rollar uchun ishlamasligi mumkin)
  const editProduct = useEditPartiyaProductStore((s) => s.product);
  useEffect(() => {
    if (!editProduct) return;
    const bc = editProduct?.bar_code;
    const computedCount = Number(
      bc?.isMetric
        ? (editProduct?.y || 0) * 100
        : tip === "recount"
        ? editProduct?.check_count || 0
        : editProduct?.count || 0
    );

    form.reset({
      code: bc?.code || "",
      isMetric: bc?.isMetric ? "Metrli" : "Donabay",
      count: computedCount,
      country: { value: bc?.country?.id || "", label: bc?.country?.title || "" },
      collection: { value: bc?.collection?.id || "", label: bc?.collection?.title || "" },
      size: { value: bc?.size?.id || "", label: bc?.size?.title || "" },
      shape: { value: bc?.shape?.id || "", label: bc?.shape?.title || "" },
      style: { value: bc?.style?.id || "", label: bc?.style?.title || "" },
      color: { value: bc?.color?.id || "", label: bc?.color?.title || "" },
      model: { value: bc?.model?.id || "", label: bc?.model?.title || "" },
      factory: {
        value: editProduct?.factory?.id || "",
        label: editProduct?.factory?.title || "",
      },
    });
    // Explicitly set count after reset (yana bir bor kafolatlash uchun)
    form.setValue("count", computedCount, { shouldDirty: false, shouldTouch: false });
  }, [editProduct, tip]);

  useEffect(() => {
    // Agar editProduct (tahrirlash) mavjud bo'lsa, qrBaseOne'dan kelgan
    // ma'lumotlar bilan formni override qilmaymiz
    if (editProduct) return;
    if (qrBaseOne) {
      form.reset({
        code: qrBaseOne?.code || "",
        isMetric: qrBaseOne?.isMetric ? "Metrli" : "Donabay",
        count: count,
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
        className="w-full h-full"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        onSubmit={form.handleSubmit((data) => {
          // Tahrirlash holatida — store'dagi editProduct'dan ishonchli ma'lumot
          const isEditing = !!editProduct;
          const editIsMetric = editProduct?.bar_code?.isMetric;
          const editCode = editProduct?.bar_code?.code;
          mutate({
            partiyaId: isEditing ? productId || "" : id || "",
            isMetric: isEditing ? Boolean(editIsMetric) : Boolean(qrBaseOne?.isMetric),
            isUpdate: isEditing,
            data: {
              code: isEditing ? editCode || "" : qrBaseOne?.code || "",
              tip: tip != "new" ? tip : undefined,
              y: data?.count,
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
