import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompleteTaskDialog from "./CompleteTaskDialog";
import { EventClubDTO } from "@/api/representative/EventAgent";

interface TaskDetailCardProps {
  task: InterTask;
  eventId: string;
  currentClub: EventClubDTO;
}

export default function TaskDetailCard({
  task,
  eventId,
  currentClub,
}: TaskDetailCardProps) {
  const navigate = useNavigate();
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const getStatusColor = (status: string) => {
    if (status === "COMPLETED") return "bg-green-100 text-green-800";
    if (status === "ON_GOING") return "bg-yellow-100 text-yellow-800";
    if (status === "NOT_STARTED") return "bg-gray-100 text-gray-800";
    return "bg-blue-100 text-blue-800";
  };

  const getStatusText = (status: string, percentage: number) => {
    if (status === "COMPLETED") return "Completed";
    if (status === "ON_GOING") return `ON_GOING (${percentage}%)`;
    if (status === "NOT_STARTED") return "Not started";
    return "Overdue";
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
            <div className="flex justify-between w-full">
              <div>
                <h1 className="text-2xl font-bold text-[#136cb9]">
                  {task.taskName}
                </h1>
                <p className="text-muted-foreground mt-2">{task.description}</p>
              </div>
              {task.status !== "COMPLETED" &&
                task.clubId === currentClub.clubId && (
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCompleteDialogOpen(true)}
                    >
                      Complete Task
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2 text-[#136CB9]">
              <Clock className="h-4 w-4" />
              Start Time
            </h4>
            <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-md">
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
            <div className="flex items-center gap-2 text-muted-foreground  p-2 rounded-md ">
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
                getStatusColor(task.status)
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
      </div>
      <CompleteTaskDialog
        open={isCompleteDialogOpen}
        onClose={() => setIsCompleteDialogOpen(false)}
        task={task}
        eventId={eventId}
      />
    </div>
  );
}
