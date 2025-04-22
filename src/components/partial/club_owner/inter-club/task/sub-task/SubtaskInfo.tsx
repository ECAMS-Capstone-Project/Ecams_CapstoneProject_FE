import { CardContent } from "@/components/ui/card";
import { EventTaskDetail } from "@/models/InterTask";
import { format } from "date-fns";

interface SubtaskInfoProps {
  subtask: EventTaskDetail;
}

export const SubtaskInfo = ({ subtask }: SubtaskInfoProps) => {
  return (
    <CardContent>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-[#136CB9]">Description</h4>
          <p>{subtask?.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-[#136CB9]">Start Time</h4>
            <p>
              {format(new Date(subtask?.startTime || ""), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-[#136CB9]">Deadline</h4>
            <p>
              {format(new Date(subtask?.deadline || ""), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-[#136CB9]">Priority</h4>
            <p>{subtask?.priority}</p>
          </div>
        </div>
      </div>
    </CardContent>
  );
};
