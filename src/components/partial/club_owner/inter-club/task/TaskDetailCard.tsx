import { cn } from "@/lib/utils";
import { InterTask } from "@/models/InterTask";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  ListTodo,
  CheckCircle,
  Circle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TaskDetailCardProps {
  task: InterTask;
}

export default function TaskDetailCard({ task }: TaskDetailCardProps) {
  const navigate = useNavigate();

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

  const getSubTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Circle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#136CB9]/10 to-[#49BBBD]/10 p-6 rounded-lg border border-[#136CB9]/20">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#136cb9]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#136cb9]">
                {task.taskName}
              </h1>
              <p className="text-muted-foreground mt-2">{task.description}</p>
            </div>
          </div>
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
              <span>{format(new Date(task.deadline), "dd/MM/yyyy HH:mm")}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium mb-1 flex items-center gap-2 text-[#136CB9]">
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

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2 text-[#136CB9]">
              <Users className="h-4 w-4" />
              Assign to club
            </h4>
            <span>{task.clubName}</span>
          </div>
        </div>

        {/* Sub-tasks Section */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2 text-[#136CB9] border-b border-[#136CB9]/20 pb-2">
            <ListTodo className="h-4 w-4" />
            Sub-tasks
          </h4>
          <div className="space-y-3">
            {task.eventTaskDetails.map((subTask) => (
              <div
                key={subTask.eventTaskDetailId}
                className="bg-white p-3 rounded-lg border border-[#136CB9]/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {getSubTaskStatusIcon(subTask.status)}
                  <div>
                    <p className="font-medium text-[#136CB9]">
                      {subTask.detailName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {subTask.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(subTask.deadline), "dd/MM/yyyy")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
