import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Controls from './Controls';
import { QRCode } from '../type';

interface QRCodePreviewProps {
    previewCode?: QRCode | null;
    inputCount: string | number;
    handleCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleGenerate: () => void;
    isGenerating?: boolean;
    totalItems:number;
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({ 
    previewCode,
    inputCount, 
    handleCountChange, 
    handleGenerate, 
    isGenerating = false,
    totalItems
}) => {
    // Generate a QR code value from the preview code or use a placeholder
    const qrValue = previewCode 
        ? `${previewCode.id}`
        : 'https://example.com/placeholder';
    
    return (
        <div className='flex min-w-[420px] flex-col items-center justify-around h-full sticky top-0 z-10 border-r-2'>
            <div className="flex items-center justify-center rounded-[32px] bg-white w-[270px] h-[270px]">
                <div className="w-[190px] h-[190px] flex items-center justify-center">
                    <QRCodeSVG
                        value={qrValue}
                        size={190}
                        level="H"
                        className="w-[190px] h-[190px]"
                    />
                </div>
            </div>
            
            {/* Controls */}
            <Controls
                count={inputCount}
                onCountChange={handleCountChange}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                totalItems={totalItems}
            />
        </div>
    );
};

export default QRCodePreview;