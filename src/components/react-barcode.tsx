import Barcode from "react-barcode";

interface BarcodeGeneratorProps {
  value: string;
  className?: string;
  /** Bitta tayoqcha qalinligi (px). Default 2 */
  width?: number;
  /** Tayoqchalar balandligi (px). Default 50 */
  height?: number;
  /** Pastdagi son. Default true */
  displayValue?: boolean;
  /** Son uchun font o'lchami (px). Default 14 */
  fontSize?: number;
  /** Atrofdagi bo'sh joy (px). Default 0 */
  margin?: number;
  /** Tayoqcha rangi. Default #1a1a1a */
  lineColor?: string;
  /** Fon rangi. Default transparent */
  background?: string;
  /** Format: CODE128, EAN13, UPC, ... — Default CODE128 */
  format?: string;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  value,
  className,
  width = 2,
  height = 50,
  displayValue = true,
  fontSize = 14,
  margin = 0,
  lineColor = "#1a1a1a",
  background = "transparent",
  format = "CODE128",
}) => {
  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <Barcode
        value={value}
        width={width}
        height={height}
        displayValue={displayValue}
        fontSize={fontSize}
        margin={margin}
        lineColor={lineColor}
        background={background}
        format={format as any}
      />
    </div>
  );
};

export default BarcodeGenerator;
