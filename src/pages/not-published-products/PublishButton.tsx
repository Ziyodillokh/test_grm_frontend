import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";
const PublishButton = ({id}: { id: string }) => {
  const [, setId] = useQueryState("id");
  return (
    <Button
      onClick={() => {
        setId(id);
      }}
      variant="ghost"
      className="h-8 w-8 p-0 text-green-600 hover:text-green-800 hover:bg-green-50"
    > 
    Опубликовать
      
    </Button>
  );
};

export default PublishButton;
