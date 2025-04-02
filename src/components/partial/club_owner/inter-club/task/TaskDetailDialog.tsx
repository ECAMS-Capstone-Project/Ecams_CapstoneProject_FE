import { format } from "date-fns";
import { Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InterTask } from "@/models/InterTask";
import { cn } from "@/lib/utils";

interface TaskDetailDialogProps {
  task: InterTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailDialog = ({
  task,
  isOpen,
  onClose,
}: TaskDetailDialogProps) => {
  if (!task) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#136CB9]">
            Task Details
          </DialogTitle>
          <DialogDescription>View the details of the task</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2 px-4">
          {/* Task Info Section */}
          <div className="bg-gradient-to-r from-[#136CB9]/10 to-[#49BBBD]/10 p-6 rounded-lg border border-[#136CB9]/20">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#136CB9]">
                  {task.taskName}
                </h3>
                <p className="text-muted-foreground mt-2">{task.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2 text-[#136CB9]">
                    <Clock className="h-4 w-4" />
                    Start Time
                  </h4>
                  <div className="flex items-center gap-2 text-muted-foreground bg-white p-2 rounded-md border border-[#136CB9]/20">
                    <Calendar className="h-4 w-4 text-[#136CB9]" />
                    <span>
                      {format(new Date(task.startTime), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2 text-[#136CB9]">
                    <AlertCircle className="h-4 w-4" />
                    Deadline
                  </h4>
                  <div className="flex items-center gap-2 text-muted-foreground bg-white p-2 rounded-md border border-[#136CB9]/20">
                    <Calendar className="h-4 w-4 text-[#136CB9]" />
                    <span>
                      {format(new Date(task.deadline), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-[#136CB9]">
                  <CheckCircle2 className="h-4 w-4" />
                  Status
                </h4>
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
          </div>

          {/* Subtasks Section */}
          {task.eventTaskDetails.length > 0 && (
            <div className="space-y-4 h-calc(100vh - 200px) overflow-y-auto">
              <h4 className="text-lg font-semibold text-[#136CB9]">Subtasks</h4>
              <div className="space-y-3">
                {task.eventTaskDetails.map((detail) => (
                  <div
                    key={detail.eventTaskDetailId}
                    className="bg-gradient-to-r from-[#49BBBD]/5 to-[#136CB9]/5 p-4 rounded-lg border border-[#49BBBD]/20"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h5 className="font-medium text-[#136CB9]">
                          {detail.detailName}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {detail.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 text-[#136CB9]" />
                          <span>
                            {format(
                              new Date(detail.startTime),
                              "dd/MM/yyyy HH:mm"
                            )}{" "}
                            -{" "}
                            {format(
                              new Date(detail.deadline),
                              "dd/MM/yyyy HH:mm"
                            )}
                          </span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium",
                          detail.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        )}
                      >
                        {detail.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
