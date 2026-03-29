import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useDataLibrary } from "./actions";
import { CropFormType, CropSchema } from "./schema";
import FormContent from "./content";
import { parseAsString, useQueryState } from "nuqs";
import { useQueryClient } from "@tanstack/react-query";

const ActionPage = () => {
  const form = useForm<CropFormType>({
    resolver: zodResolver(CropSchema),
    defaultValues:{
      title:"",
      collection: {
        value: undefined,
        label: "",
      },
    },
  });
 
  const [type] = useQueryState("type",parseAsString.withDefault('country'))
  const [idMadal,setidMadal] = useQueryState("idMadal",parseAsString.withDefault('new'))
const queryClient = useQueryClient()

  const { mutate ,isPending} = useDataLibrary({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
      form.setValue('title',"")
      if(type != "model"){
        form.setValue('collection',{
          value: undefined,
          label: "",
        })
      }
        form.setValue('country',{
          value: undefined,
          label: "",
        })
      setidMadal("new")
      if (idMadal == "new") {
        toast.success("savedSuccessfully");
      } else {
        toast.success("updatedSuccessfully");
      }
    },
  });

  useEffect(()=>{
    form.setValue('title',"")
    form.setValue('collection',{
      value: undefined,
      label: "",
    })
    form.setValue('country',{
      value: undefined,
      label: "",
    })
    form.setValue('factory',{
      value: undefined,
      label: "",
    })
    setidMadal("new")
  },[type])

  return (
    <FormProvider {...form}>
      <form
      className="w-1/3 flex"
        onSubmit={form.handleSubmit((data) => {
          mutate({url:`/${type}`, data: data, id: idMadal !== "new" ? idMadal : undefined });
        })}
      >
        <FormContent isPending={isPending} />
      </form>
    </FormProvider>

  );
};

export default ActionPage;
