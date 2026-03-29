import { QRCode } from './type';
import { toast } from 'sonner';

/**
 * Format date to readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

/**
 * Generate QR code value from QR code object
 */
export const generateQRValue = (qrCode:any): string => {
  return `${qrCode.sequence}`;
};

/**
 * Generate a PDF document with QR codes - one QR code per page
 * Uses jspdf and qrcode libraries
 */
export const generatePDF = async (codes: QRCode[]): Promise<void> => {
  try {
    toast.info('Подготовка PDF документа...');
    
    const [jsPDFModule, QRCodeModule] = await Promise.all([
      import('jspdf'),
      import('qrcode')
    ]);
    
    const { default: jsPDF } = jsPDFModule;
    const { toDataURL } = QRCodeModule;
    
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Settings for QR codes layout
    const qrSize = 100; // Larger QR code since we're only putting one per page
    
    // Process each QR code
    const generateQRDataUrls = async () => {
      const urls = [];
      for (const code of codes) {
        const qrValue = generateQRValue(code);
        const dataUrl = await toDataURL(qrValue, {
          errorCorrectionLevel: 'H',
          margin: 1,
          width: qrSize * 3 // Higher resolution for better quality
        });
        urls.push({ dataUrl, code });
      }
      return urls;
    };
    
    const qrDataUrls = await generateQRDataUrls();
    
    // Generate PDF pages - one QR code per page
    for (let i = 0; i < qrDataUrls.length; i++) {
      // Add a new page for each QR code (except the first one)
      if (i > 0) {
        doc.addPage();
      }
      
      const { dataUrl, code } = qrDataUrls[i];
      
      // Center the QR code on the page
      const x = (pageWidth - qrSize) / 2;
      const y = (pageHeight - qrSize) / 2 - 10; // Slightly above center to make room for text
      
      // Add QR code image
      doc.addImage(dataUrl, 'PNG', x, y, qrSize, qrSize);
      
      // Add QR code number as text
      doc.setFontSize(14);
      const text = `${code.sequence}`;
      const textWidth = doc.getStringUnitWidth(text) * doc.getFontSize() / doc.internal.scaleFactor;
      const textX = (pageWidth - textWidth) / 2;
      doc.text(text, textX, y + qrSize + 10);
      
    }
    
    // Save the PDF
    doc.save(`qr-codes-${new Date().toISOString().slice(0, 10)}.pdf`);
    
    toast.success(`PDF с ${codes.length} QR-кодами успешно создан`);
  } catch (error) {
    toast.error('Ошибка при создании PDF. Попробуйте еще раз или обратитесь к администратору.');
    throw error; // Re-throw to allow handling in the component
  }
};

/**
 * Print QR codes directly - one QR code per page
 */
export const printQRCodes = (codes: QRCode[]): void => {
  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error('Пожалуйста, разрешите всплывающие окна для печати');
      return;
    }
    
    // Generate HTML content for printing - one QR code per page with flexible sizing
    let html = `
      <html>
      <head>
        <title>QR Codes Print</title>
        <style>
          /* Reset margins and padding */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          /* Basic body setup */
          body {
            font-family: Arial, sans-serif;
          }
          
          /* Page container that works for any page size */
          .page {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            page-break-after: always;
            position: relative;
            padding: 5%;
          }
          
          .page:last-child {
            page-break-after: avoid;
          }
          
          /* QR code container - will center on any page size */
          .qr-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 100vmin; /* Responsive to viewport */
          }
          
          /* QR code - adapts to available space while maintaining aspect ratio */
          .qr-code {
            width: 70vmin; /* Larger size since we have one per page */
            height: 70vmin;
            max-width: 500px; /* Cap size for very large displays */
            max-height: 500px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .qr-code img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          /* QR code label */
          .qr-value {
            margin-top: 4vmin;
            font-size: calc(12pt + 0.5vmin);
            font-weight: bold;
            text-align: center;
          }
          
          /* Page number - stays at bottom */
          .page-number {
            position: absolute;
            bottom: 3vmin;
            text-align: center;
            font-size: calc(8pt + 0.3vmin);
            color: #666;
          }
          
          /* Print-specific settings */
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            /* Ensure page breaks work properly */
            .page {
              break-inside: avoid;
              break-after: page;
            }
            
            .page:last-child {
              break-after: auto;
            }
          }
        </style>
      </head>
      <body>
    `;
    
    // Create a page for each QR code
    codes.forEach((code: QRCode) => {
      const qrValue = generateQRValue(code);
      
      html += `
        <div class="page">
          <div class="qr-container">
            <div class="qr-code">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrValue)}" 
                alt="QR Code ${code.sequence}" 
              />
            </div>
            <div class="qr-value">${code.sequence}</div>
          </div>
        </div>
      `;
    });
    
    html += `
      </body>
      </html>
    `;
    
    // Write to the window and print
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Print when loaded
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
        // Close the window after printing
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      }, 1000); // Give time for images to load
    };
  } catch (error) {
    console.error('Error printing QR codes:', error);
    toast.error('Ошибка при печати QR-кодов');
  }
};