import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { apiRoutes } from "@/service/apiRoutes";

import { useQrBaseById, useQrBaseMutation } from "./actions";
import FormContent from "./content";
import { QrBaseFormType, QrBaseSchema } from "./schema";

const PulishMadal = () => {
  const form = useForm<QrBaseFormType>({
    resolver: zodResolver(QrBaseSchema),
  })
  const [id, setId] = useQueryState("id");
  const { data } = useQrBaseById({
    id: id != "new" ? id || undefined : undefined,
  });

  const queryQrBase = useQueryClient();
  const resetForm = () => {
    form.reset({
      code: "",
      imgUrl: {
        id: "",
        url: "",
      },
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
      sizeType: {
        value: "",
        label: "",
      }
    });
  };
  const { mutate } = useQrBaseMutation({
    onSuccess: () => {
      resetForm();
      setId(null);
      queryQrBase.invalidateQueries({ queryKey: [apiRoutes.clients] });
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
        code: data?.code,
        country: {
          value: data?.country?.id,
          label: data?.country?.title,
        },
        collection: {
          value: data?.collection?.id,
          label: data?.collection?.title,
        },
        sizeType: {
          value: data?.sizeType,
          label: data?.sizeType,
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
        model: {
          value: data?.model?.id,
          label: data?.model?.title,
        },
        factory: {
          value: data?.factory?.id,
          label: data?.factory?.title,
        },
        i_price: data?.i_price,
        internetInfo: data?.internetInfo || data?.collection?.description,
        imgUrl: {
          id: data?.imgUrl?.id,
          url: data?.imgUrl?.path,
        }
      });
    }
  }, [data]);

  console.log(form.formState.errors);
  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(isopen: boolean) => {
        resetForm();
        if (!isopen) {
          setId(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-[996px]">
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

export default PulishMadal;
