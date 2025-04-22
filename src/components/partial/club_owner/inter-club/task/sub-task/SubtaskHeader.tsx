/* eslint-disable react-refresh/only-export-components */
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { EventTaskDetail } from "@/models/InterTask";

interface SubtaskHeaderProps {
  subtask: EventTaskDetail;
  onBack: () => void;
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "ON_GOING":
      return "bg-blue-500";
    case "COMPLETED":
      return "bg-green-500";
    case "REVIEWING":
      return "bg-yellow-500";
    case "OVERDUE":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const SubtaskHeader = ({ subtask, onBack }: SubtaskHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#136cb9]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#136cb9]">
              {subtask?.detailName}
            </h1>
          </div>
        </div>
        <Badge className={getStatusColor(subtask?.status || "")}>
          {subtask?.status}
        </Badge>
      </CardTitle>
    </CardHeader>
  );
};
