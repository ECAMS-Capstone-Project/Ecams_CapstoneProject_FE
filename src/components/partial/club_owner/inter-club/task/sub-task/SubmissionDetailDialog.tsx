import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  MessageSquare,
  User,
  Calendar,
  UserRoundCheck,
} from "lucide-react";
import { EventTaskDetail, InterTaskSubmission } from "@/models/InterTask";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { SubmissionFeedbackForm } from "./SubmissionFeedbackForm";

interface SubmissionDetailDialogProps {
  submission: InterTaskSubmission | null;
  onClose: () => void;
  score: number;
  feedback: string;
  onScoreChange: (score: number) => void;
  onFeedbackChange: (feedback: string) => void;
  onSaveFeedback: () => void;
  isSubmitting: boolean;
  onDownloadAll: () => void;
  subtask: EventTaskDetail;
}

export const SubmissionDetailDialog = ({
  submission,
  onClose,
  score,
  feedback,
  onScoreChange,
  onFeedbackChange,
  onSaveFeedback,
  isSubmitting,
  onDownloadAll,
  subtask,
}: SubmissionDetailDialogProps) => {
  if (!submission) return null;

  return (
    <Dialog open={!!submission} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-[#136CB9] text-xl flex items-center gap-2">
            {submission.submissionFile &&
            submission.submissionFile.length > 0 ? (
              <FileText className="h-5 w-5" />
            ) : (
              <MessageSquare className="h-5 w-5" />
            )}
            Submission Detail
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#136CB9]/10 to-[#49BBBD]/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-[#136CB9] font-semibold mb-1">
                <User className="h-4 w-4" />
                Student Name
              </div>
              <p className="text-sm">{submission.memberName}</p>
            </div>

            <div className="bg-gradient-to-br from-[#136CB9]/10 to-[#49BBBD]/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-[#136CB9] font-semibold mb-1">
                <UserRoundCheck className="h-4 w-4" />
                Review By
              </div>

              <p className="text-sm">{submission.reviewer?.fullname}</p>
            </div>
            <div className="bg-gradient-to-br from-[#136CB9]/10 to-[#49BBBD]/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-[#136CB9] font-semibold mb-1">
                <Calendar className="h-4 w-4" />
                Submitted At
              </div>

              <p className="text-sm">
                {submission.submissionDate !== "0001-01-01T00:00:00" &&
                  submission.submissionDate && (
                    <p className="text-sm">
                      {format(
                        new Date(submission.submissionDate),
                        "dd/MM/yyyy HH:mm"
                      )}
                    </p>
                  )}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="border border-[#136CB9]/20 rounded-lg p-4">
            <h3 className="font-semibold text-[#136CB9] mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Submission Content
            </h3>
            <div className="bg-gradient-to-br from-[#136CB9]/5 to-[#49BBBD]/5 p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">
                {submission.studentSubmission || "No content provided yet"}
              </p>
            </div>
          </div>

          {/* Attachment */}
          {submission.submissionFile &&
            submission.submissionFile.length > 0 && (
              <div className="border border-[#136CB9]/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-[#136CB9] flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Attachment
                  </h3>
                  <Button
                    onClick={onDownloadAll}
                    className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] text-white hover:opacity-90"
                  >
                    Download All
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-[#136CB9]/5 to-[#49BBBD]/5 p-4 rounded-lg">
                  {submission.submissionFile.map((fileUrl, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center mb-2"
                    >
                      <a
                        href={fileUrl}
                        className="text-sm text-[#136CB9] underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Attachment {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Grade and Feedback */}
          <SubmissionFeedbackForm
            score={score}
            feedback={feedback}
            onScoreChange={onScoreChange}
            onFeedbackChange={onFeedbackChange}
            subtask={subtask}
          />
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            onClick={onSaveFeedback}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] text-white hover:opacity-90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Feedback"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
