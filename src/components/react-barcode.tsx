import Barcode from "react-barcode";

interface BarcodeGeneratorProps {
  value: string;
  className?: string;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ value,className }) => {
  return (
    <div className={`flex justify-center`}>
      <Barcode  className={className} value={value} />
    </div>
  );
};
export default BarcodeGenerator;