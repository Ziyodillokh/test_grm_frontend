import { Mic, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BidirectionalAudioVisualizer from "@/components/bidirectional-audio-visualizer";
import { useState } from "react";

export default function Content() {
  const [messageType,setMessageType] = useState("text")
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="bg-[#E6E6D9] flex py-[4px] items-center gap-2 px-3 border-b">
        <img src="/logo1.svg" className="w-[43px] h-[36px]" />
        <h2 className="text-[#5D5D53] text-[14px] font-normal">
          Суний интелек
        </h2>
      </div>
      <div>
        {
          messageType == "mic" ?   <BidirectionalAudioVisualizer/>:""
        }
  
      </div>
      <div className="bg-[#E6E6D9] border-t flex">
        <Button
          type={"button"}
          // onClick={() => setId("new")}
          className={`rounded-full w-11 h-11 mx-[15px] my-2.5 `}
          variant={"outline"}
          size={"icon"}
        >
          <Plus color="#5D5D53" width={24} height={24} />
        </Button>
        <Input
          placeholder="Пишите сюда"
          className=" h-full text-[16px] border-none "
        />
         <Button
          type={"button"}
          onClick={() => setMessageType(state=>state =="mic" ? "text": "mic")}
          className={`rounded-full w-11 h-11 mx-[15px] my-2.5 `}
          size={"icon"}
        >
          <Mic color="white" width={24} height={24} />
        </Button>
      </div>
    </div>
  );
}
