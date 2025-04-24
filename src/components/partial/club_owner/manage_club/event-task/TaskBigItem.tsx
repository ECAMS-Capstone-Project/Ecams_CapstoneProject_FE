import { Button } from "@/components/ui/button";
import { InterTask, UpdateInterTaskRequest2 } from "@/models/InterTask";
import { format } from "date-fns";
import { Calendar, MoreHorizontal, Users2 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useInterTask } from "@/hooks/club/useInterTask";
import { InterClubEventDTO } from "@/models/Event";
import { useNavigate } from "react-router-dom";
import { TaskBigEditDialog } from "./TaskBigEditDialog";
import toast from "react-hot-toast";

interface TaskItemProps {
  task: InterTask;
  selectedEvent: InterClubEventDTO;
  isClubOwner: boolean
}

export const TaskBigItem = ({
  task,
  selectedEvent,
  isClubOwner,
}: TaskItemProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();
  const getStatusColor = (status: string, percentage: number) => {
    if (status === "COMPLETED")
      return "bg-green-100 text-green-800";
    if (percentage > 0 || status === "ON_GOING")
      return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const getStatusText = (status: string, percentage: number) => {
    if (status === "COMPLETED") return "Completed";
    if (percentage > 0 || status === "ON_GOING")
      return `ON_GOING (${percentage}%)`;
    return "Overdue";
  };
  const { updateInterEventTask2, isUpdating2 } = useInterTask();
  const handleUpdateTask = async (
    taskId: string,
    data: Partial<UpdateInterTaskRequest2>
  ) => {
    try {
      await updateInterEventTask2({
        eventTaskId: taskId,
        clubId: data.clubId || task.clubId,
        eventId: selectedEvent.eventId,
        taskName: data.taskName || task.taskName,
        description: data.description || "",
        startTime: data.startTime || "",
        deadline: data.deadline || "",
        status: data.status || task.status,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleClick = () => {
    const taskStart = new Date(task.startTime);
    const now = new Date();

    if (taskStart <= now) {
      toast.error("This task has already started");
    } else {
      setIsEditOpen(true);
    }
  };

  return (
    <>
      <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
        <div className="flex justify-between items-start">
          <div className="w-4/5">
            <h3 className="font-bold text-[#136CB9]">Task: {task.taskName}</h3>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-justify text-muted-foreground mt-1">
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
                Deadline: {format((task.deadline), "dd/MM/yyyy HH:mm a")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 h-full">
            <span
              className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
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
                <DropdownMenuItem onClick={() =>
                  navigate(`/club/event-subtask/${selectedEvent.eventId}`, { state: { isClubOwner: isClubOwner, task: task, clubId: selectedEvent.clubs[0]?.clubId } })
                }>
                  View
                </DropdownMenuItem>
                {isClubOwner && (
                  <DropdownMenuItem
                    onClick={() => handleClick()}
                    disabled={task.completionPercentage === 100}
                  >
                    Edit
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <TaskBigEditDialog
        onUpdate={handleUpdateTask}
        task={task}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        isLoading={isUpdating2}
        selectedEvent={selectedEvent}
      />
    </>
  );
};
