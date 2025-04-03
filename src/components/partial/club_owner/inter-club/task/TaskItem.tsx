import { Button } from "@/components/ui/button";
import { InterTask, UpdateInterTaskRequest } from "@/models/InterTask";
import { format } from "date-fns";
import { Calendar, MoreHorizontal, Users2 } from "lucide-react";
import { useState } from "react";
import { TaskDetailDialog } from "./TaskDetailDialog";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { TaskEditDialog } from "./TaskEditDialog";
import { useInterTask } from "@/hooks/club/useInterTask";
import { InterClubEventDTO } from "@/models/Event";

interface TaskItemProps {
  task: InterTask;
  isHost: boolean;
  selectedEvent: InterClubEventDTO;
}

export const TaskItem = ({ task, isHost, selectedEvent }: TaskItemProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
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
  const { updateInterEventTask, isUpdating } = useInterTask();
  const handleUpdateTask = async (
    taskId: string,
    data: Partial<UpdateInterTaskRequest>
  ) => {
    try {
      await updateInterEventTask({
        eventTaskId: taskId,
        clubId: data.clubId || task.clubId,
        eventId: selectedEvent.eventId,
        taskName: data.taskName || task.taskName,
        description: data.description || task.description,
        startTime: data.startTime || task.startTime,
        deadline: data.deadline || task.deadline,
        status: data.status || task.status,
        eventTaskDetails: data.eventTaskDetails || task.eventTaskDetails,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-[#136CB9]">Task: {task.taskName}</h3>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground mt-1">
                Description: {task.description}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users2 className="h-4 w-4" />
                Assign to:{" "}
                <span className="font-semibold text-[#3c81bd]">
                  {task.clubName}
                </span>
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <TaskDetailDialog
        task={task}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
      <TaskEditDialog
        onUpdate={handleUpdateTask}
        task={task}
        isHost={isHost}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        isLoading={isUpdating}
        selectedEvent={selectedEvent}
      />
    </>
  );
};
