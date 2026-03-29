import { FileDown, Loader } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { UploadFile } from "@/service/apiHelpers";
import { toast } from "sonner";
const maxFileSize = 5000000;

export default function UploadExel() {
    const [loading,setLoading]= useState(false)
    const hendleimg = async (
        e: ChangeEvent<HTMLInputElement>
      ) => {
        setLoading(true)
        const files = e.target.files;
        if (files && files[0] && files[0].size < maxFileSize) {
          const file = files[0];
          const formData = new FormData();
          formData.append("file", file);
          await UploadFile('qr-base/support', formData)
            .then((data) => {
                console.log(data)
                toast.success('Файл успешно импортирована')
            })
            .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
      };
  return (
    <label>
        <div className="h-full border-l border-border flex w-full max-w-[300px] text-nowrap items-center cursor-pointer  px-[50px] gap-1 text-primary text-[14px] border-y-0" >
           {loading?<Loader size={20} className="animate-spin"/> :<FileDown size={20}/>} 
        Импортировать excel
        </div>
        <input
            className="hidden"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => {
            hendleimg(e);
            }}
                />
    </label>
  )
}
