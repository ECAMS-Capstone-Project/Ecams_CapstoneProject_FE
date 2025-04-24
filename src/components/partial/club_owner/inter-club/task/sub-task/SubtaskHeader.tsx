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
    case "NOT_STARTED":
      return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    case "ON_GOING":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "COMPLETED":
      return "bg-green-200 text-green-800 hover:bg-green-300";
    case "REVIEWING":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "OVERDUE":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-700";
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
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(subtask?.status || "")}>
            {subtask?.status}
          </Badge>
        </div>
      </CardTitle>
    </CardHeader>
  );
};
