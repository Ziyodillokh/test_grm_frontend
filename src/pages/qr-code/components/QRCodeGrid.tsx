import React, { useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRCode } from '../type';
import { Loader2 } from 'lucide-react';

interface QRCodeGridProps {
  codes: QRCode[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

const QRCodeGrid: React.FC<QRCodeGridProps> = ({ 
  codes, 
  isLoading = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!fetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading && codes.length === 0) {
    return (
      <div className="w-full flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Загрузка QR-кодов...</span>
      </div>
    );
  }

  if (codes.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-[400px] text-center">
        <p className="text-lg mb-2">Нет доступных QR-кодов</p>
        <p className="text-sm text-muted-foreground">
          Используйте форму слева, чтобы сгенерировать новые QR-коды
        </p>
      </div>
    );
  }

  // Generate QR code value from sequence number
  const getQRValue = (code: QRCode) => {
    return `${code.sequence}`;
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-128px)] overflow-auto">
      <div className="flex flex-wrap p-8 gap-4">
        {codes.map((qr) => (
          <div 
            key={qr.id} 
            className="bg-white w-[126px] h-[180px] p-4 flex flex-col items-center justify-center shadow-sm"
          >
            <QRCodeSVG 
              value={getQRValue(qr)} 
              size={84}
              level="H"
            />
            <div className="mt-2 text-center text-sm">
              {qr.sequence}
              {!qr.is_active && <span className="block text-red-500 text-xs">Неактивный</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Load more sentinel element */}
      {(hasNextPage || isFetchingNextPage) && fetchNextPage && (
        <div 
          ref={loadMoreRef} 
          className="w-full py-4 flex justify-center"
        >
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Загрузка...</span>
            </div>
          ) : (
            <div className="h-8" /> // Empty space for intersection observer
          )}
        </div>
      )}
      
      {/* End of list message */}
      {!hasNextPage && codes.length > 10 && (
        <div className="text-center py-4 text-gray-500">
          Загружены все QR-коды
        </div>
      )}
    </div>
  );
};

export default QRCodeGrid;