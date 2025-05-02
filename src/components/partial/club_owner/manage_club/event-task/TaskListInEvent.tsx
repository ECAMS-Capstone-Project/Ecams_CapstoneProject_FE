import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  Clock,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  EventTaskDetail,
  InterTask,
  UpdateInterTaskRequest2,
  UpdateSubtaskRequest,
} from "@/models/InterTask";
import { cn, fixTime } from "@/lib/utils";
import EventTaskBreadcrumb from "./EventTaskBreadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditSubTaskDialog from "./EditSubTaskDialog";
import {
  GetSubTaskEventAPI,
  GetSubTaskEventByUserAPI,
} from "@/api/club-owner/TaskAPI";
import LoadingAnimation from "@/components/ui/loading";
import toast from "react-hot-toast";
import { useInterTask } from "@/hooks/club/useInterTask";
import DeleteSubtaskDialog from "../../inter-club/task/sub-task/DeleteSubtaskDialog";
import { UpdateInterTask2 } from "@/api/club-owner/InterEventTask";
import ConfirmEndEventDialog from "./ConfirmEndEventDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuth from "@/hooks/useAuth";

export default function TaskListInEvent() {
  const { eventId = "" } = useParams();
  const location = useLocation();
  const isClubOwner = location.state?.isClubOwner as boolean;
  const clubId = location.state?.clubId as string;
  const task = location.state?.task as InterTask;
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editingTask, setEditingTask] = useState<EventTaskDetail | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subTaskList, setSubTaskList] = useState<EventTaskDetail[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPages, setTotalPages] = useState<number | undefined>();
  const [flag, setFlag] = useState<boolean>(false);
  const { updateSubtask, isUpdating2 } = useInterTask();
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async () => {
    const data: UpdateInterTaskRequest2 = {
      eventTaskId: task.eventTaskId,
      clubId: clubId,
      eventId: eventId,
      taskName: task.taskName,
      description: task.description,
      startTime: fixTime(task.startTime).toISOString(),
      deadline: fixTime(task.deadline).toISOString(),
      status: "COMPLETED",
    };
    await UpdateInterTask2(data);
    toast.success("Task completed");
    window.history.back();
  };

  const getStatusColor = (status: string, percentage: number) => {
    if (status === "COMPLETED" && percentage === 100)
      return "bg-green-100 text-green-800";
    if (percentage >= 0 && status === "ON_GOING")
      return "bg-yellow-100 text-yellow-800";
    if (status === "NOT_STARTED") return "bg-gray-200 text-gray-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusText = (status: string, percentage: number) => {
    if (status === "COMPLETED" && percentage === 100) return "Completed";
    if (percentage >= 0 && status === "ON_GOING")
      return `ON_GOING (${percentage}%)`;
    if (status === "NOT_STARTED") return "Not started";
    return "Overdue";
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const loadTasks = async () => {
      if (!user || !user.userId || !task.eventTaskId)
        return <LoadingAnimation />;
      setIsLoading(true);
      try {
        const response = isClubOwner
          ? await GetSubTaskEventAPI(
              task.eventTaskId,
              pageNo,
              debouncedSearch,
              pageSize
            )
          : await GetSubTaskEventByUserAPI(
              task.eventTaskId,
              pageNo,
              debouncedSearch,
              user.userId,
              pageSize
            );

        setSubTaskList(response.data?.data || []);
        setTotalPages(response.data?.totalPages);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [
    eventId,
    pageNo,
    pageSize,
    isClubOwner,
    user,
    task.eventTaskId,
    debouncedSearch,
    flag,
  ]);

  const handleNavigate = (task: EventTaskDetail) => {
    navigate(`/club/task-detail/${task.eventTaskDetailId}`, {
      state: {
        isClubOwner,
        taskDetail: task,
        clubId: clubId,
        eventId: eventId,
        bigTask: task,
      },
    });
  };

  const filteredTasks = useMemo(() => {
    const priorityOrder: Record<"HIGH" | "MEDIUM" | "LOW", number> = {
      HIGH: 1,
      MEDIUM: 2,
      LOW: 3,
    };

    // B1: Filter theo search term
    const searchedTasks = subTaskList?.filter((task) =>
      task.detailName?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    // B2: Sort theo priority: HIGH -> MEDIUM -> LOW
    const sortedTasks = searchedTasks?.sort((a, b) => {
      return (
        priorityOrder[a.priority as "HIGH" | "MEDIUM" | "LOW"] -
        priorityOrder[b.priority as "HIGH" | "MEDIUM" | "LOW"]
      );
    });

    // B3: Paginate sau khi sort
    return sortedTasks;
  }, [subTaskList, debouncedSearch]);

  const handleEditSubmit = async (updatedTask: UpdateSubtaskRequest) => {
    try {
      await updateSubtask({
        eventTaskId: task.eventTaskId,
        eventTaskDetailId: updatedTask.eventTaskDetailId,
        subtask: updatedTask,
      });
      setFlag((pre) => !pre);
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  return (
    <div className="space-y-6">
      <EventTaskBreadcrumb
        items={[
          { label: "Event List" },
          { label: "Task list in event", href: `/club/event-task/${eventId}` },
          { label: "Sub task list in event" },
        ]}
      />
      <div>
        <Card className="p-6 rounded-lg bg-blue-50">
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-4 justify-between">
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#136cb9]" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-blue-600">
                      {task?.taskName}
                    </h1>
                  </div>
                </div>
                <div>
                  {task.status != "COMPLETED" && isClubOwner && (
                    <div>
                      <Button
                        onClick={() => setOpen(true)}
                        variant={"custom"}
                        className="font-bold"
                      >
                        Complete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground mt-2">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Start Time
                  </p>
                  <p>
                    {task?.startTime
                      ? format(new Date(task.startTime), "dd/MM/yyyy - HH:mm a")
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Deadline</p>
                  <p>
                    {task?.deadline
                      ? format(new Date(task.deadline), "dd/MM/yyyy - HH:mm a")
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium ml-1.5 text-gray-700">
                    Status
                  </p>
                  <span
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium",
                      getStatusColor(task.status, task.completionPercentage)
                    )}
                  >
                    {getStatusText(task.status, task.completionPercentage)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CircleDot className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Quantity of sub task
                  </p>
                  <p>{subTaskList?.length}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Card className="bg-gray-50">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-blue-500 flex items-center gap-2">
            <CheckCircle2 size={18} />
            Sub task list
          </h2>

          {isClubOwner && (
            <div className="flex justify-between">
              <div className="w-1/4 md:w-1/4 xs:1/2">
                <Input
                  placeholder="Search sub task"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                onClick={() =>
                  navigate("/club/create-event-task", {
                    state: { clubId: clubId, task: task, eventId: eventId },
                  })
                }
                className="flex items-center gap-2 text-white"
                variant={"custom"}
              >
                <PlusCircle className="w-4 h-4" />
                Create Sub Task
              </Button>
            </div>
          )}

          <div className="grid gap-4">
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <Skeleton key={index} className="h-28 rounded-xl" />
              ))
            ) : filteredTasks?.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                💤 No tasks found.
              </div>
            ) : (
              filteredTasks &&
              filteredTasks.map((task) => (
                <motion.div
                  key={task.eventTaskDetailId}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`rounded-lg border ${
                      task.priority.toUpperCase() === "HIGH"
                        ? "bg-red-50 border-red-200 text-red-900"
                        : task.priority.toUpperCase() === "MEDIUM"
                        ? "bg-yellow-50 border-yellow-200 text-yellow-900"
                        : "bg-blue-50 border-blue-200 text-blue-900"
                    }`}
                  >
                    <CardContent className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">
                              {task.detailName}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-sm font-semibold px-2 py-1 rounded-md",
                                {
                                  ON_GOING: "bg-blue-100 text-blue-800",
                                  COMPLETED: "bg-green-100 text-green-800",
                                  REVIEWING: "bg-yellow-100 text-yellow-800",
                                  OVERDUE: "bg-red-100 text-red-800",
                                }[task.status] || "bg-gray-100 text-gray-800"
                              )}
                            >
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleNavigate(task)}
                            >
                              View
                            </DropdownMenuItem>
                            {isClubOwner && (
                              <DropdownMenuItem
                                onClick={() => {
                                  const taskStart = new Date(task.startTime);
                                  const now = new Date();
                                  if (taskStart <= now) {
                                    toast.error(
                                      "This task has already started"
                                    );
                                    return;
                                  } else {
                                    setEditingTask(task);
                                    setIsEditDialogOpen(true);
                                  }
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                            )}
                            {isClubOwner && (
                              <DropdownMenuItem
                                disabled={task.status == "COMPLETED"}
                                onClick={() => {
                                  setIsDeleteDialogOpen(true);
                                  setEditingTask(task);
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            <span className="text-foreground font-medium">
                              Start Time:
                            </span>{" "}
                            {format(
                              new Date(task.startTime),
                              "dd/MM/yyyy - HH:mm a"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            <span className="text-foreground font-medium">
                              Deadline:
                            </span>{" "}
                            {format(
                              new Date(task.deadline),
                              "dd/MM/yyyy - HH:mm a"
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {!isLoading && totalPages !== undefined && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <Button
                variant="outline"
                disabled={pageNo === 1}
                onClick={() => setPageNo((prev) => prev - 1)}
              >
                Back
              </Button>
              <span className="text-sm">
                Page <strong>{pageNo}</strong> / {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pageNo === totalPages}
                onClick={() => setPageNo((prev) => prev + 1)}
              >
                Next
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm">Show</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setPageNo(1);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="5" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm">items</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <EditSubTaskDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        task={editingTask}
        bigTask={task}
        onSubmit={handleEditSubmit}
        isUpdating={isUpdating2}
      />
      <DeleteSubtaskDialog
        subtask={editingTask}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        setFlag={setFlag}
      />
      <ConfirmEndEventDialog
        open={open}
        setOpen={setOpen}
        handleSubmit={handleSubmit}
        title="Do you want to complete this task?"
      />
    </div>
  );
}
