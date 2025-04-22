import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NumbersRounded } from "@mui/icons-material";
import { AvailableMember } from "@/models/InterTask";
import { format } from "date-fns";

interface MemberInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: AvailableMember;
  recommendation?: {
    memberId: string;
    fullName: string;
    reason: string;
    currentTasks: {
      taskId: string;
      detailName: string;
      description: string;
      startTime: string;
      deadline: string;
      submissionDate: string;
      submissionScore: number;
    }[];
    relatedTasks: {
      taskId: string;
      detailName: string;
      description: string;
      startTime: string;
      deadline: string;
      submissionDate: string;
      submissionScore: number;
    }[];
  };
}

export const MemberInfoDialog = ({
  isOpen,
  onClose,
  member,
  recommendation,
}: MemberInfoDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="space-y-1 p-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[#136CB9] text-xl flex items-center gap-2 font-bold">
              <Users className="h-5 w-5" />
              Member Information
            </DialogTitle>
          </div>
          <DialogDescription>
            View member information and task history
          </DialogDescription>
        </div>
        <div className="space-y-6 ">
          {/* Member Profile */}
          <div className="flex items-start gap-4 p-7 bg-gradient-to-r from-[#136CB9]/10 to-[#49BBBD]/10 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#136CB9]">
                  {member.fullName}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="h-4 w-4" />
                    <span className="font-bold">Email: </span>
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <NumbersRounded className="h-4 w-4" />
                    <span className="font-bold">Activity Point: </span>
                    <span>{member.clubActivityPoint}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="h-4 w-4" />
                    <span className="font-bold">Student ID: </span>

                    <span>{member.studentId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          {recommendation && (
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-indigo-900 mb-2 flex items-center gap-2">
                    AI Recommendation
                  </h4>
                  <p className="text-sm text-indigo-700 leading-relaxed">
                    {recommendation.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tasks Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-bold text-[#136CB9]">Related Tasks</h4>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium">Task Name</TableHead>
                  <TableHead className="font-medium">Description</TableHead>
                  <TableHead className="font-medium">Deadline</TableHead>
                  <TableHead className="font-medium">Submission Date</TableHead>
                  <TableHead className="font-medium">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Current Task
                <TableRow className="bg-blue-50/50">
                  <TableCell className="font-medium">Current Task</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-700 border-blue-200"
                    >
                      In Progress
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("vi-VN")}
                  </TableCell>
                </TableRow> */}
                {/* Sample Tasks */}
                {recommendation?.relatedTasks.map((task) => (
                  <TableRow key={task.taskId}>
                    <TableCell>{task.detailName}</TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {task.description}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {format(task.deadline, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {format(task.submissionDate, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {task.submissionScore}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/*Current Task*/}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-bold text-[#3c9899]">Current Tasks</h4>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium">Task Name</TableHead>
                  <TableHead className="font-medium">Description</TableHead>
                  <TableHead className="font-medium">Deadline</TableHead>
                  <TableHead className="font-medium">Submission Date</TableHead>
                  <TableHead className="font-medium">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Current Task
                <TableRow className="bg-blue-50/50">
                  <TableCell className="font-medium">Current Task</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-700 border-blue-200"
                    >
                      In Progress
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("vi-VN")}
                  </TableCell>
                </TableRow> */}
                {/* Sample Tasks */}
                {recommendation?.currentTasks.map((task) => (
                  <TableRow key={task.taskId}>
                    <TableCell>{task.detailName}</TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {task.description}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {format(task.deadline, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {task.submissionDate
                        ? format(task.submissionDate, "dd/MM/yyyy")
                        : "Not submitted yet"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {task.submissionScore}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
