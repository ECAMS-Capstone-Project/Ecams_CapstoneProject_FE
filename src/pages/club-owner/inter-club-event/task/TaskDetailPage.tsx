import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useInterTask } from "@/hooks/club/useInterTask";
import TaskDetailCard from "@/components/partial/club_owner/inter-club/task/TaskDetailCard";

import { EventClubDTO } from "@/api/representative/EventAgent";
import {
  Calendar,
  CheckCircle,
  Circle,
  ListTodo,
  PlusCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useClub } from "@/hooks/club/useClub";
import { NewSubtaskDialog } from "@/components/partial/club_owner/inter-club/task/sub-task/NewSubtaskDialog";
import { InterTaskSchema } from "@/schema/InterTaskSchema";
import { z } from "zod";
import { InterClubEventDTO } from "@/models/Event";
import { UpdateInterTaskRequest } from "@/models/InterTask";
import { fixTime } from "@/lib/utils";

export const TaskDetailPage = () => {
  const { eventTaskId } = useParams();
  const { getInterTaskDetailQuery } = useInterTask();
  const { data: response, isLoading } = getInterTaskDetailQuery(
    eventTaskId || ""
  );
  const navigate = useNavigate();
  const { state } = useLocation();
  const currentClub = state?.currentClub as EventClubDTO;
  const selectedEvent = state?.selectedEvent as InterClubEventDTO;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { members: clubMembers } = useClub(currentClub.clubId);
  const { updateInterEventTask } = useInterTask();

  const availableMembers = clubMembers.filter(
    (member) => member.clubRoleName !== "CLUB_OWNER"
  );
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!response?.data) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Task not found</div>
      </div>
    );
  }

  const task = response.data;

  const getSubTaskStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "ON_GOING":
        if (
          task.eventTaskDetails.some(
            (subTask) => subTask.priority.toUpperCase() === "HIGH"
          )
        ) {
          return <Circle className="h-4 w-4 text-white" />;
        } else if (
          task.eventTaskDetails.some(
            (subTask) => subTask.priority.toUpperCase() === "MEDIUM"
          )
        ) {
          return <Circle className="h-4 w-4 text-yellow-600" />;
        } else {
          return <Circle className="h-4 w-4 text-blue-600" />;
        }
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };
  const handleAddSubtask = async (values: z.infer<typeof InterTaskSchema>) => {
    console.log("add subtask", values);
    try {
      const updateData: UpdateInterTaskRequest = {
        eventTaskId: task.eventTaskId,
        clubId: task.clubId,
        eventId: selectedEvent.eventId,
        taskName: task.taskName,
        description: task.description,
        startTime: fixTime(task.startTime),
        deadline: fixTime(task.deadline),
        status: task.status,
        eventTaskDetails: values.listEventTaskDetails.map((detail) => ({
          eventTaskId: task.eventTaskId,
          detailName: detail.detailName,
          description: detail.description,
          startTime: fixTime(detail.startTime || new Date()),
          deadline: fixTime(detail.deadline || new Date()),
          status: detail.status || "ON_GOING",
          priority: detail.priority,
          assignedMembers: detail.assignedMembers || [],
        })),
      };

      await updateInterEventTask(updateData);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };
  return (
    <div className="container mx-auto space-y-6">
      {/* Task Info Section */}
      <TaskDetailCard task={task} />
      {/* Tabs Section */}
      {/* Sub-tasks Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium flex items-center gap-2 text-[#136CB9] border-b border-[#136CB9]/20 pb-2">
            <ListTodo className={`h-4 w-4 `} />
            Sub-tasks
          </h4>
          {task.clubId === currentClub.clubId && (
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] text-white hover:opacity-90"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Sub-task
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {task.eventTaskDetails.map((subTask) => (
            <div
              key={subTask.eventTaskDetailId}
              className={`p-3 rounded-lg border border-[#136CB9]/20 flex items-center justify-between cursor-pointer ${
                subTask.priority.toUpperCase() === "HIGH"
                  ? "bg-pink-400"
                  : subTask.priority.toUpperCase() === "MEDIUM"
                  ? "bg-yellow-200"
                  : "bg-blue-300"
              }`}
              onClick={() => {
                navigate(
                  `/club/inter-club-event/subtask/${subTask.eventTaskDetailId}`,
                  {
                    state: {
                      currentClub,
                      subTask: subTask,
                      task: task,
                      selectedEvent,
                    },
                  }
                );
              }}
            >
              <div className="flex items-center gap-3">
                {getSubTaskStatusIcon(subTask.status)}
                <div>
                  <p
                    className={`font-medium ${
                      subTask.priority.toUpperCase() === "HIGH"
                        ? "text-white"
                        : subTask.priority.toUpperCase() === "MEDIUM"
                        ? "text-yellow-800"
                        : "text-[#136CB9]"
                    }`}
                  >
                    {subTask.detailName}
                  </p>
                  <p
                    className={`text-sm  ${
                      subTask.priority.toUpperCase() === "HIGH"
                        ? "text-white"
                        : subTask.priority.toUpperCase() === "MEDIUM"
                        ? "text-yellow-800"
                        : "text-[#136CB9]"
                    }`}
                  >
                    {subTask.description}
                  </p>
                </div>
              </div>
              <div
                className={`text-sm flex items-center gap-2  ${
                  subTask.priority.toUpperCase() === "HIGH"
                    ? "text-white"
                    : subTask.priority.toUpperCase() === "MEDIUM"
                    ? "text-yellow-800"
                    : "text-[#136CB9]"
                }`}
              >
                <Calendar className="h-4 w-4" />
                {format(new Date(subTask.deadline), "dd/MM/yyyy")}
              </div>
            </div>
          ))}
          {task.eventTaskDetails.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-20 text-gray-600">
              <img
                src="https://img.freepik.com/free-vector/flat-scrum-task-board-with-color-stick-paper-notes_88138-931.jpg?t=st=1745413930~exp=1745417530~hmac=39a15caf14ef23431d71ab10bd019f2f864edee0b85c4d5d7fab0d769fb86f01&w=2000"
                alt="No sub-tasks"
                className="w-1/5 mb-4 opacity-90"
              />
              <h3 className="text-2xl font-semibold text-[#136CB5] mb-2">
                No sub-tasks yet
              </h3>
              <p className="text-sm max-w-md text-gray-500">
                Currently, the assigned club have not created any sub-tasks for
                this task yet. Check back later! 💡
              </p>
            </div>
          )}
        </div>
      </div>
      <NewSubtaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={(data) => {
          // Chỉ gửi thông tin của subtask mới
          handleAddSubtask({
            taskName: task.taskName,
            description: task.description,
            startTime: fixTime(task.startTime),
            deadline: fixTime(task.deadline),
            status: task.status,
            listEventTaskDetails: [
              {
                detailName: data.detailName,
                description: data.description,
                startTime: fixTime(data.startTime),
                deadline: fixTime(data.deadline),
                status: data.status,
                priority: data.priority,
                assignedMembers: data.assignedMembers || [],
              },
            ],
          });
        }}
        members={availableMembers}
        currentClub={currentClub}
      />
    </div>
  );
};
