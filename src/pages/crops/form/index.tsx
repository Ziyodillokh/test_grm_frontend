import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { CropFormType, CropSchema } from "./schema";
import CropFormContent from "./CropContent";
import { useCropById, useCropMutation } from "./actions";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { parseISO } from "date-fns";

const ActionPage = () => {
  const form = useForm<CropFormType>({
    resolver: zodResolver(CropSchema),
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useCropById({
    id: id != "new" ? id : undefined,
    queries: {
      populate: "*",
    },
  });
  const { mutate } = useCropMutation({
    onSuccess: () => {
      if (id == "new") {
        toast.success("savedSuccessfully");
      } else {
        toast.success("updatedSuccessfully");
      }
      navigate("/crops");
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name || "",
        biology_name: data?.biology_name || "",
        planting_time_end: parseISO(data?.planting_time_end) || "",
        planting_time_start: parseISO(data?.planting_time_start) || "",
        crop_code: data?.crop_code || "",
        is_common: data?.is_common,
        harvest_duration: data?.harvest_duration || 0,
        description: data?.description || "",
        crop_category: String(data?.crop_category?.id) || undefined,
        main_image: data?.main_image || undefined,
      });
    }
  }, [data]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          mutate({ data: data, id: id !== "new" ? id : undefined });
        })}
      >
        <CropFormContent />
      </form>
    </FormProvider>
  );
};

export default ActionPage;
