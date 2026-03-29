interface CollectionCardProps {
  title: string;
  size: number;
  count: number;
  price: number;
}

export default function CollectionCard({ title, size, count, price }: CollectionCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-[16px] font-medium text-gray-900">{title}</h3>
      <div className="mt-1 text-[14px] text-gray-600">
        {size} м² | {count} шт
      </div>
      <div className="mt-2 text-[14px] text-[#E38157]">
        {price} $
      </div>
    </div>
  );
} 