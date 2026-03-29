import { zodResolver } from "@hookform/resolvers/zod";
import { parseISO } from "date-fns";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { usePartiyaById, usePartiyaMutation } from "./actions";
import FormContent from "./CropContent";
import { PartiyaFormType, PartiyaSchema } from "./schema";
import { useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/service/apiRoutes";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQueryState } from "nuqs";

const ActionPage = () => {
  const form = useForm<PartiyaFormType>({
    resolver: zodResolver(PartiyaSchema),
  });
  const [id,setId] = useQueryState("id")

  const { data } = usePartiyaById({
    id: (id != "new" && id ) ? id : undefined,
    queries: {
      populate: "*",
    },
  });
  const resetForm =()=>{
    form.reset({
      country: undefined,
      factory: undefined,
      partiya_no:undefined,
      warehouse: undefined,
      user: undefined,
      expense:  undefined,
      volume:  undefined,
      date: undefined,
    })
  }
  const queryClient= useQueryClient()
  const { mutate,isPending } = usePartiyaMutation({
    onSuccess: () => {
      // apiRoutes.parties
      if (id == "new") {
        toast.success("savedSuccessfully");
      } else {
        toast.success("updatedSuccessfully");
      }
      setId(null)
      resetForm()
      queryClient.invalidateQueries({ queryKey: [apiRoutes.parties] });
      // navigate("/Partiyas");
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        country: {
          label:data?.country?.title,
          value:data?.country?.id
        },
        factory: {
          label:data?.factory?.title,
          value:data?.factory?.id
        },
        partiya_no: {
          label:data?.partiya_no?.title,
          value:data?.partiya_no?.id
        },
        warehouse: {
          label:data?.warehouse?.title,
          value:data?.warehouse?.id
        },
        user: {
          label:data?.user?.firstName,
          value:data?.user?.id
        },
        expense: data?.expense ?? undefined,
        volume: data?.volume ?? undefined,
        date: parseISO(data?.date) || "",
        
      });
    }
  }, [data]);
  useEffect(()=>{
    if(!id || id=="new"){
      resetForm()
    }
  },[id])

  return (
    <Dialog open={Boolean(id)} onOpenChange={() => {
      setId(null)
      resetForm()
      }}>
       <DialogContent className="sm:max-w-[796px]">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                mutate({ data: data, id: (id != "new" && id) ? id : undefined });
              })}
            >
              <FormContent isPending={isPending} />
            </form> 
          </FormProvider>
       </DialogContent>
    </Dialog>
  );
};

export default ActionPage;
