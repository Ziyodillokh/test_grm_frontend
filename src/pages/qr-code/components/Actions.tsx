import React from 'react';
import { Trash2, Download, Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionsProps {
  onClear: () => void;
  onDownload: () => void;
  onPrint: () => void;
  isClearing?: boolean;
  isDownloading?: boolean;
}

const Actions: React.FC<ActionsProps> = ({ 
  onClear, 
  onDownload, 
  onPrint,
  isClearing = false,
  isDownloading = false
}) => {
  return (
    <div className="flex ml-auto">
      <Button 
        onClick={onClear}
        className="flex w-[180px] items-center justify-center gap-2 text-[#5D5D53] bg-[#E6E6D9] px-6 py-8 border-l border-border hover:text-white"
        disabled={isClearing}
      >
        {isClearing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Очистка...</span>
          </>
        ) : (
          <>
            <Trash2 size={18} />
            <span>Очистить</span>
          </>
        )}
      </Button>
      <Button 
        onClick={onDownload}
        className="flex items-center w-[180px] justify-center gap-2 text-[#5D5D53] bg-[#E6E6D9] px-6 py-8 border-l border-border hover:text-white"
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Скачивание...</span>
          </>
        ) : (
          <>
            <Download size={18} />
            <span>Скачать как pdf</span>
          </>
        )}
      </Button>
      <Button 
        onClick={onPrint}
        className="flex items-center w-[180px] justify-center gap-2 px-6 py-8 border-l border-border text-white"
      >
        <Printer size={18} />
        <span>Распечатать</span>
      </Button>
    </div>
  );
};

export default Actions;