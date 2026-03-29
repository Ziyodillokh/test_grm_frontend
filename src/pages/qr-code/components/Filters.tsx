import React from 'react';
import { QRCodeIcon, BrCodeIcons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { TabType } from '../type';
import Actions from './Actions';

interface FiltersProps {
  activeTab: TabType;
  prefix: string;
  onPrefixChange: (prefix: string) => void;
  onTabChange: (tab: TabType) => void;
  actions: {
    handleClear: () => void;
    handleDownload: () => void;
    handlePrint: () => void;
    isClearing?: boolean;
    isDownloading?: boolean;
  };
}

const Filters: React.FC<FiltersProps> = ({
  activeTab,
  onTabChange,
  actions
}) => {
  return (
    <div className="bg-sidebar h-[64px] flex justify-between sticky top-0">
      <div className="flex">
        <Button
          className={`flex w-[210px] items-center justify-center gap-2 text-[#5D5D53] bg-[#E6E6D9] py-8 ${
            activeTab === 'barcode' ? 'bg-accent' : ''
          }`}
          variant="outline"
          onClick={() => onTabChange('barcode')}
        >
          <BrCodeIcons />
          <span>Баркод</span>
        </Button>
        
        <Button
          className={`flex w-[210px] items-center justify-center gap-2 text-[#5D5D53] bg-[#E6E6D9] px-6 py-8 ${
            activeTab === 'qr' ? 'bg-accent' : ''
          }`}
          variant="outline"
          onClick={() => onTabChange('qr')}
        >
          <QRCodeIcon />
          <span>QR код</span>
        </Button>
      </div>
      <div className="flex">
        <Actions 
          onClear={actions.handleClear}
          onDownload={actions.handleDownload}
          onPrint={actions.handlePrint}
          isClearing={actions.isClearing}
          isDownloading={actions.isDownloading}
        />
      </div>
    </div>
  );
};

export default Filters;