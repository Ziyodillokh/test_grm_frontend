import React, { ChangeEvent } from 'react'
import { FileOutput, Loader } from 'lucide-react';
import { UploadFile } from '@/service/apiHelpers';

const maxFileSize = 5000000;

export default function FileExelUpload({partiyaId}:{partiyaId:string}) {
    const [loadingFile, setLoadingFile] = React.useState(false);
    const hendleimg = async (
        e: ChangeEvent<HTMLInputElement>,
      ) => {
        
        if (e.target.files && e.target.files[0] && e.target.files[0].size < maxFileSize) {
            setLoadingFile(true);
          const file = e.target.files[0];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("partiyaId", partiyaId);
          
          await UploadFile(`/excel`,formData)
            .then((data) => {
                console.log(data);
            })
            .finally(() => setLoadingFile(false));
        } else {
          setLoadingFile(false);
        }
      };
  return (
    <label className='flex w-full cursor-pointer border-border  max-w-[180px] justify-center items-center p-3 gap-2'>
    {/* <Button className="h-full  border-y-0 " variant={"outline"}> */}
        {loadingFile ? <Loader size={16}/>: <FileOutput size={16} /> }  Импорт файл
            <input
                className="hidden"
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => {
                    hendleimg(e);
                }}
                />
        {/* </Button> */}
    </label>
        
  )
}
