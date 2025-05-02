import { Button } from "@/components/ui/button";
import { InterTask, UpdateInterTaskRequest } from "@/models/InterTask";
import { format } from "date-fns";
import { Calendar, MoreHorizontal, Users2 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { TaskEditDialog } from "./TaskEditDialog";
import { useInterTask } from "@/hooks/club/useInterTask";
import { InterClubEventDTO } from "@/models/Event";
import { EventClubDTO } from "@/api/representative/EventAgent";
import { useNavigate } from "react-router-dom";

interface TaskItemProps {
  task: InterTask;
  isHost: boolean;
  selectedEvent: InterClubEventDTO;
  currentClub: EventClubDTO;
}

export const TaskItem = ({
  task,
  isHost,
  selectedEvent,
  currentClub,
}: TaskItemProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();
  const getStatusColor = (status: string, percentage: number) => {
    if (status === "COMPLETED") return "bg-green-100 text-green-800";
    if (percentage > 0 && status === "ON_GOING")
      return "bg-yellow-100 text-yellow-800";
    if (status === "NOT_STARTED")
      return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    return "bg-red-100 text-red-800";
  };

  const getStatusText = (status: string, percentage: number) => {
    if (status === "COMPLETED") return "Completed";
    if (percentage > 0 && status === "ON_GOING")
      return `ON_GOING (${percentage}%)`;
    if (status === "NOT_STARTED") return "Not Started";
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
  // const isAssigned = task.eventTaskDetails.map(
  //   (detail) => (
  //     detail.assignedMembers && detail.assignedMembers.length > 0,
  //     detail.assignedMembers &&
  //       detail.assignedMembers.length > 0 &&
  //       console.log("num of assigned", detail.assignedMembers.length)
  //   )
  // );

  return (
    <>
      <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-[#136CB9]">Task: {task.taskName}</h3>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1 max-w-5xl">
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
                <DropdownMenuItem
                  onClick={() =>
                    navigate(
                      `/club/inter-club-event/task/${task.eventTaskId}`,
                      {
                        state: {
                          currentClub: currentClub,
                          selectedEvent: selectedEvent,
                        },
                      }
                    )
                  }
                >
                  View
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setIsEditOpen(true)}
                  disabled={task.completionPercentage === 100 || !isHost}
                >
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <TaskEditDialog
        onUpdate={handleUpdateTask}
        task={task}
        isHost={isHost}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        isLoading={isUpdating}
        selectedEvent={selectedEvent}
        currentClub={currentClub}
      />
    </>
  );
};
