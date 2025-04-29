import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { EventRefundDTO } from "@/models/Event";

interface CellActionProps {
  data: EventRefundDTO;
  onView: (data: EventRefundDTO) => void;
}

export const CellAction: React.FC<CellActionProps> = ({ data, onView }) => {
  return (
    <Button variant="outline" size="sm" onClick={() => onView(data)}>
      <Eye className="h-4 w-4 mr-2" />
      View Details
    </Button>
  );
};
