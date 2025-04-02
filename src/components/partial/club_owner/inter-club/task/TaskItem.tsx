import { Button } from "@/components/ui/button";
import { InterTask } from "@/models/InterTask";
import { format } from "date-fns";
import { Calendar, Eye } from "lucide-react";
import { useState } from "react";
import { TaskDetailDialog } from "./TaskDetailDialog";

interface TaskItemProps {
  task: InterTask;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getStatusColor = (status: string, percentage: number) => {
    if (status === "COMPLETED" || percentage === 100)
      return "bg-green-100 text-green-800";
    if (percentage > 0 || status === "ON_GOING")
      return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const getStatusText = (status: string, percentage: number) => {
    if (status === "COMPLETED" || percentage === 100) return "Completed";
    if (percentage > 0 || status === "ON_GOING")
      return `ON_GOING (${percentage}%)`;
    return "Overdue";
  };

  return (
    <>
      <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Task: {task.taskName}</h3>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground mt-1">
                Description: {task.description}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Start Time:{" "}
                {format(new Date(task.startTime), "dd/MM/yyyy HH:mm")}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Deadline: {format(new Date(task.deadline), "dd/MM/yyyy HH:mm")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 h-full">
            <span
              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                task.status,
                task.completionPercentage
              )}`}
            >
              {getStatusText(task.status, task.completionPercentage)}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDetailOpen(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <TaskDetailDialog
        task={task}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
};
