import React, { useState } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';
import { toast } from 'sonner';

import QRCodeGrid from './components/QRCodeGrid';
import QRCodePreview from './components/QRCodePreview';
import Filters from './components/Filters';

import { TabType } from './type';
import { generatePDF, printQRCodes } from './utils';
import { useQRCodesFetch, useGenerateQRCodes, useClearQRCodes } from './queries';

const QRCodeGenerator: React.FC = () => {
  const [limit] = useQueryState('limit', parseAsInteger.withDefault(10)); // Match API default
  const [prefix, setPrefix] = useQueryState('prefix', { defaultValue: '' });
  const [type, setType] = useQueryState('type', { defaultValue: 'qr' as TabType });
  
  const [inputCount, setInputCount] = useState<number | string>(100);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useQRCodesFetch({
    limit,
    prefix,
    type
  });
  
  const qrCodes = data?.pages?.flatMap(page => page.items) || [];
  const previewCode = qrCodes.length > 0 ? qrCodes[0] : null;
  const totalItems = data?.pages[0].meta.totalItems || 0;

  const { mutate: generateQRCodes, isPending: isGenerating } = useGenerateQRCodes();
  const { mutate: clearQRCodes, isPending: isClearing } = useClearQRCodes();
  
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setInputCount(value === '' ? '' : parseInt(value, 10));
  };
  
  const handleGenerate = () => {
    const count = typeof inputCount === 'number' ? inputCount : 100;
    
    if (count <= 0) {
      toast.error("Количество QR-кодов должно быть больше 0");
      return;
    }
    if (count > 1000) {
      toast.error("Нельзя сгенерировать больше 1000 QR-кодов за раз");
      return;
    }
    generateQRCodes(count);
  };
  
  const handleClear = () => {
    if (qrCodes.length === 0) {
      toast.info("Нет QR-кодов для очистки");
      return;
    }
    
    if (window.confirm("Вы уверены, что хотите очистить все QR-коды?")) {
      clearQRCodes();
      setInputCount(100);
      setPrefix('');
    }
  };
  
  const handleDownload = async () => {
    if (qrCodes.length === 0) {
      toast.error("Нет QR-кодов для скачивания");
      return;
    }
    try {
      setIsDownloading(true);
      await generatePDF(qrCodes);
    } catch (error) {
      toast.error('Ошибка при скачивании PDF');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handlePrint = () => {
    if (qrCodes.length === 0) {
      toast.error("Нет QR-кодов для печати");
      return;
    }
    printQRCodes(qrCodes);
  };

  const actions = {
    handleClear,
    handleDownload,
    handlePrint,
    isClearing,
    isDownloading
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Filters
        activeTab={type}
        prefix={prefix}
        onPrefixChange={setPrefix}
        onTabChange={setType}
        actions={actions}
      />
      
      <div className="flex flex-1">
        <QRCodePreview 
          previewCode={previewCode}
          inputCount={inputCount} 
          handleCountChange={handleCountChange} 
          handleGenerate={handleGenerate} 
          isGenerating={isGenerating}
          totalItems={totalItems}
        />
        
        <QRCodeGrid 
          codes={qrCodes} 
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
};

export default QRCodeGenerator;