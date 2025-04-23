import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  Download,
  User,
  Calendar,
  Star,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  submission: {
    id: string;
    fileName?: string;
    fileUrl?: string;
    submittedAt: string;
    submittedBy: string;
    content?: string;
    feedback?: string;
    grade?: number;
  };
}

export const TaskSubmissionDialog = ({
  isOpen,
  onClose,
  submission,
}: TaskSubmissionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#136CB9] text-xl flex items-center gap-2">
            {submission.fileName ? (
              <FileText className="h-5 w-5" />
            ) : (
              <MessageSquare className="h-5 w-5" />
            )}
            Submission Detail
          </DialogTitle>
          <DialogDescription>
            View details of the task's submission from your members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#136CB9]/10 to-[#49BBBD]/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-[#136CB9] font-semibold mb-1">
                <User className="h-4 w-4" />
                Student Name
              </div>
              <p className="text-sm">{submission.submittedBy}</p>
            </div>

            <div className="bg-gradient-to-br from-[#136CB9]/10 to-[#49BBBD]/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-[#136CB9] font-semibold mb-1">
                <Calendar className="h-4 w-4" />
                Submitted At
              </div>
              <p className="text-sm">
                {format(new Date(submission.submittedAt), "dd/MM/yyyy HH:mm")}
              </p>
            </div>

            {submission.grade !== undefined && (
              <div className="bg-gradient-to-br from-[#136CB9]/10 to-[#49BBBD]/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-[#136CB9] font-semibold mb-1">
                  <Star className="h-4 w-4" />
                  Grade
                </div>
                <p className="text-sm">{submission.grade} points</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="border border-[#136CB9]/20 rounded-lg p-4">
            <h3 className="font-semibold text-[#136CB9] mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Submission Content
            </h3>
            <div className="bg-gradient-to-br from-[#136CB9]/5 to-[#49BBBD]/5 p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">
                {submission.content || "No content provided"}
              </p>
            </div>
          </div>

          {/* Attachment */}
          {submission.fileName && submission.fileUrl && (
            <div className="border border-[#136CB9]/20 rounded-lg p-4">
              <h3 className="font-semibold text-[#136CB9] mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Attachment
              </h3>
              <div className="bg-gradient-to-br from-[#136CB9]/5 to-[#49BBBD]/5 p-4 rounded-lg flex items-center justify-between">
                <span className="text-sm">{submission.fileName}</span>
                <Button
                  className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] text-white hover:opacity-90"
                  size="sm"
                  asChild
                >
                  <a
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Feedback */}
          {submission.feedback && (
            <div className="border border-[#136CB9]/20 rounded-lg p-4">
              <h3 className="font-semibold text-[#136CB9] mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Feedback
              </h3>
              <div className="bg-gradient-to-br from-[#136CB9]/5 to-[#49BBBD]/5 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">
                  {submission.feedback}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
