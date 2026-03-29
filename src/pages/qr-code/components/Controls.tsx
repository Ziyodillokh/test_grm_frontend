import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ControlsProps {
  count: number | string;
  onCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  totalItems:number;
}

const Controls: React.FC<ControlsProps> = ({
  count,
  onCountChange,
  onGenerate,
  isGenerating = false,
  totalItems
}) => {
  return (
    <div className="p-4 border-t w-full flex-col border-border flex items-center justify-center gap-4">
      <div className="relative w-full mb-6 flex flex-col items-center">
        <Input
          type="text"
          value={count}
          onChange={onCountChange}
          className="py-2 w-[83px] px-4 border border-border rounded text-center"
          disabled={isGenerating}
        />
        <div className="absolute -bottom-5 left-0 w-full text-center text-xs text-muted-foreground">
          Количество QR-кодов
        </div>
      </div>
      <Button 
        onClick={onGenerate}
        className="py-6 px-8 w-[346px] bg-[#5D5D53] text-white rounded-[2px]"
        disabled={!!totalItems}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Генерация...
          </>
        ) : (
          `Сгенерировать`
          
        )}
      </Button>
    </div>
  );
};

export default Controls;