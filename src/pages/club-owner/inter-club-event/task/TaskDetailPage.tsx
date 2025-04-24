import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useInterTask } from "@/hooks/club/useInterTask";
import TaskDetailCard from "@/components/partial/club_owner/inter-club/task/TaskDetailCard";

import { EventClubDTO } from "@/api/representative/EventAgent";
import {
  Calendar,
  CheckCircle,
  Circle,
  ListTodo,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useClub } from "@/hooks/club/useClub";
import { NewSubtaskDialog } from "@/components/partial/club_owner/inter-club/task/sub-task/NewSubtaskDialog";
import { newSubtaskSchema } from "@/schema/InterTaskSchema";
import { z } from "zod";
import { InterClubEventDTO } from "@/models/Event";
import {
  EventTaskDetail,
  SubtaskCreateRequest,
  UpdateSubtaskRequest,
} from "@/models/InterTask";
import { fixTime } from "@/lib/utils";
import EditSubTaskDialog2 from "@/components/partial/club_owner/inter-club/task/sub-task/EditSubtaskDialog";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import DeleteSubtaskDialog from "@/components/partial/club_owner/inter-club/task/sub-task/DeleteSubtaskDialog";

export const TaskDetailPage = () => {
  const { eventTaskId } = useParams();
  const { getInterTaskDetailQuery } = useInterTask();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: response, isLoading } = getInterTaskDetailQuery(
    eventTaskId || ""
  );
  const navigate = useNavigate();
  const { state } = useLocation();
  const currentClub = state?.currentClub as EventClubDTO;
  const selectedEvent = state?.selectedEvent as InterClubEventDTO;
  const [editingTask, setEditingTask] = useState<EventTaskDetail | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { members: clubMembers } = useClub(currentClub.clubId);
  const {
    isUpdating,
    createSubtask,
    updateSubtask,
    // isCreatingSubtask,
  } = useInterTask();
  const queryClient = useQueryClient();

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
  const handleAddSubtask = async (values: z.infer<typeof newSubtaskSchema>) => {
    console.log("add subtask", values);
    try {
      const createData: SubtaskCreateRequest = {
        eventTaskId: task.eventTaskId,
        detailName: values.detailName,
        description: values.description,
        startTime: fixTime(values.startTime || new Date()).toISOString(),
        deadline: fixTime(values.deadline || new Date()).toISOString(),
        priority: values.priority,
        assignedMemberIds: values.assignedMemberIds || [],
        taskDependencyIds: values.taskDependencyIds || [],
      };

      await createSubtask({
        subtask: createData,
        eventTaskId: task.eventTaskId,
      });
      if (response.statusCode === 200) {
        setIsCreateDialogOpen(false);
      } else {
        setIsCreateDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to create subtask:", error);
      throw error; // Ném lỗi để NewSubtaskDialog biết và không đóng dialog
    }
  };
  const handleEditSubtask = async (updatedTask: UpdateSubtaskRequest) => {
    await updateSubtask({
      eventTaskId: task.eventTaskId,
      eventTaskDetailId: updatedTask.eventTaskDetailId,
      subtask: updatedTask,
    });
    queryClient.invalidateQueries({
      queryKey: ["interTasks", selectedEvent.eventId, 1, 99],
    });
    queryClient.invalidateQueries({
      queryKey: ["interTaskDetail", task.eventTaskId],
    }); // Tự động refetch danh sách ✅
  };
  return (
    <div className="container mx-auto space-y-6">
      {/* Task Info Section */}
      <TaskDetailCard
        task={task}
        eventId={selectedEvent.eventId}
        currentClub={currentClub}
      />
      {/* Tabs Section */}
      {/* Sub-tasks Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium flex items-center gap-2 text-[#136CB9] border-b border-[#136CB9]/20 pb-2">
            <ListTodo className={`h-4 w-4 `} />
            Sub-tasks
          </h4>
          {task.clubId === currentClub.clubId &&
            task.status !== "COMPLETED" && (
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
              className={`p-3 rounded-lg border border-[#136CB9]/20 flex items-center justify-between cursor-pointer z-10 ${
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
                {task.clubId === currentClub.clubId && (
                  // <Button
                  //   variant="ghost"
                  //   className="w-10 h-10 z-50 relative hover:bg-transparent "
                  //   type="button"

                  // >
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="z-50 relative  rounded-full"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {task.clubId === currentClub.clubId && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              const taskStart = new Date(subTask.startTime);
                              const now = new Date();
                              if (taskStart <= now) {
                                toast.error("This task has already started");
                                return;
                              } else {
                                setEditingTask(subTask);
                                setIsEditDialogOpen(true);
                              }
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDeleteDialogOpen(true);
                            setEditingTask(subTask);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                  // </Button>
                )}
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
        onSubmit={async (data) => {
          try {
            await handleAddSubtask({
              detailName: data.detailName,
              description: data.description,
              startTime: fixTime(data.startTime),
              startTimeTime: data.startTimeTime,
              deadline: fixTime(data.deadline),
              deadlineTime: data.deadlineTime,
              status: data.status,
              priority: data.priority,
              assignedMemberIds: data.assignedMemberIds || [],
              taskDependencyIds: data.taskDependencyIds || [],
            });
          } catch (error) {
            // Giữ dialog mở khi có lỗi
            console.error("Error in onSubmit:", error);
          }
        }}
        members={availableMembers}
        currentClub={currentClub}
        task={task}
      />

      <EditSubTaskDialog2
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        task={editingTask}
        onSubmit={handleEditSubtask}
        bigTask={task}
        isUpdating={isUpdating}
      />
      <DeleteSubtaskDialog
        subtask={editingTask}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};
