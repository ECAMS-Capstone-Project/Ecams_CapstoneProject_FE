import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QuestionMark } from "@mui/icons-material";
import { AlertCircle, Users } from "lucide-react";

interface MemberInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    memberEmail: string;
    memberName: string;
    clubMemberId: string;
  };
  recommendation?: {
    memberId: string;
    fullName: string;
    reason: string;
    relatedTasks: {
      taskId: string;
      taskName: string;
      description: string;
      startTime: string;
      deadline: string;
      status: boolean;
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
      <DialogContent className="max-w-2xl">
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
          <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-[#136CB9]/10 to-[#49BBBD]/10 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#136CB9]">
                  {member.memberName}
                </h3>
              </div>
              {/* <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined:{" "}
                      {new Date(member.joinedAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>Email: {member.memberEmail}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <NumbersRounded className="h-4 w-4" />
                    <span>Activity Point: {member.clubActivityPoint}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>Student ID: {member.studentId}</span>
                  </div>
                </div>
              </div> */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <QuestionMark className="h-4 w-4" />
                <span>Reason: This is a reason</span>
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
              <h4 className="font-medium text-gray-800">Task History</h4>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium">Task Name</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Current Task */}
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
                </TableRow>
                {/* Sample Tasks */}
                <TableRow>
                  <TableCell>Tech talk</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 border-green-200"
                    >
                      Completed
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("vi-VN")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Event Planning</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-700 border-yellow-200"
                    >
                      In Progress
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("vi-VN")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};