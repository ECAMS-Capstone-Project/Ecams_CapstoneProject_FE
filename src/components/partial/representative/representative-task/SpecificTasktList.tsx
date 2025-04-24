/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TaskDependencyResponseDTO } from "@/models/InterTask";

// Props
interface SpecificTaskListProps {
  tasks: TaskDependencyResponseDTO[];
  selected: string[];
  handleToggleTask: (taskId: string, checked: boolean) => void;
  taskDependencies: TaskDependencyResponseDTO[];
}

const SpecificTaskList: React.FC<SpecificTaskListProps> = ({
  tasks,
  selected,
  handleToggleTask,
  taskDependencies,
}) => {
  const [open1, setOpen1] = useState(false);
  const [selectedTask, setSelectedTask] =
    useState<TaskDependencyResponseDTO | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const CHUNK_SIZE = 5;
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [tasks]);

  const displayed = tasks.slice(0, page * CHUNK_SIZE);

  const handleScroll = () => {
    if (!containerRef.current || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (page * CHUNK_SIZE < tasks.length) {
        setIsLoadingMore(true);

        setTimeout(() => {
          setPage((prev) => prev + 1);
          setIsLoadingMore(false);
        }, 2000);
      }
    }
  };

  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;
    div.addEventListener("scroll", handleScroll);
    return () => {
      div.removeEventListener("scroll", handleScroll);
    };
  }, [page, tasks.length]);

  const handleClick = (task: TaskDependencyResponseDTO) => {
    setSelectedTask(task);
    setOpen1(true);
  };

  return (
    <div
      ref={containerRef}
      className="border p-3 rounded space-y-2 max-h-96 overflow-y-auto"
    >
      {displayed.map((task) => {
        const isChecked =
          selected.includes(task.eventTaskDetailId) ||
          (taskDependencies &&
            taskDependencies.some(
              (dependency) =>
                task.eventTaskDetailId === dependency.eventTaskDetailId
            ));

        console.log(isChecked);
        return (
          <div
            key={task.eventTaskDetailId}
            className="grid grid-cols-[auto_1fr_auto] items-center w-full rounded-xl border border-muted bg-background px-4 py-3 shadow-sm hover:shadow-md transition gap-3"
          >
            <Checkbox
              checked={isChecked}
              onCheckedChange={(checked) =>
                handleToggleTask(task.eventTaskDetailId, !!checked)
              }
            />
            <div className="flex flex-col gap-1">
              <span className="text-base font-semibold text-foreground">
                {task.detailName}
              </span>
              <span className="text-sm text-muted-foreground">
                Deadline:{" "}
                {task.deadline
                  ? format(task.deadline, "yyyy-MM-dd - HH:mm")
                  : "N/A"}
              </span>
              <span className="text-sm text-muted-foreground">
                Status:{" "}
                <span
                  className={`
                            font-medium 
                            ${
                              task.status === "Completed"
                                ? "text-green-600"
                                : task.status === "In Progress"
                                ? "text-blue-600"
                                : "text-yellow-600"
                            }
                          `}
                >
                  {task.status}
                </span>
              </span>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`
                          px-2 py-0.5 rounded-full text-xs font-medium 
                          ${
                            task.priority === "High"
                              ? "bg-red-100 text-red-600"
                              : task.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-100 text-gray-600"
                          }
                        `}
              >
                {task.priority}
              </span>
              <button
                className="p-2 rounded-md hover:bg-accent transition"
                onClick={() => handleClick(task)}
                type="button"
              >
                <Eye className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        );
      })}

      {isLoadingMore && (
        <div className="text-center text-sm text-muted-foreground py-4 animate-pulse">
          Loading more task...
        </div>
      )}

      <Dialog open={open1} onOpenChange={() => setOpen1(false)}>
        <DialogContent className="space-y-2 max-w-2xl">
          <DialogTitle className="flex justify-between items-center">
            Task Detail
          </DialogTitle>
          {selectedTask && (
            <Card className="shadow-lg border rounded-2xl p-6 bg-[#f3f7fa]">
              <CardHeader className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-base text-muted-foreground">
                    <b>Detail Name:</b>{" "}
                    <span className="text-foreground">
                      {selectedTask.detailName}
                    </span>
                  </p>
                  <p className="text-base text-muted-foreground">
                    <b>Priority:</b>{" "}
                    <span className="text-foreground">
                      {selectedTask.priority}
                    </span>
                  </p>
                  <p className="text-base text-muted-foreground">
                    <b>Start Time:</b>{" "}
                    <span className="text-foreground">
                      {selectedTask.startTime
                        ? format(selectedTask.startTime, "yyyy-MM-dd - HH:mm")
                        : "N/A"}
                    </span>
                  </p>
                  <p className="text-base text-muted-foreground">
                    <b>Deadline:</b>{" "}
                    <span className="text-foreground">
                      {selectedTask.deadline
                        ? format(selectedTask.deadline, "yyyy-MM-dd - HH:mm")
                        : "N/A"}
                    </span>
                  </p>
                  <p className="text-base text-muted-foreground">
                    <b>Status:</b>{" "}
                    <span
                      className={`font-medium ${
                        selectedTask.status === "Completed"
                          ? "text-green-600"
                          : selectedTask.status === "In Progress"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {selectedTask.status}
                    </span>
                  </p>
                </div>
                <div className="pt-2 text-base text-muted-foreground">
                  <b>Description:</b>
                  <p className="mt-1 text-foreground whitespace-pre-line">
                    {selectedTask.description}
                  </p>
                </div>
              </CardHeader>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecificTaskList;
