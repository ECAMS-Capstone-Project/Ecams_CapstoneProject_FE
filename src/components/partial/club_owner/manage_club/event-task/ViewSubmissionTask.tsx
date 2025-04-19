import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ViewSubmissionDialogProps {
    open: boolean;
    onClose: () => void;
    submission: any;
    taskScore: number;
}

export const ViewSubmissionDialog = ({
    open,
    onClose,
    submission,
    taskScore,
}: ViewSubmissionDialogProps) => {
    if (!submission) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>View Submission</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <p><strong>Student:</strong> {submission.memberName}</p>
                    <p><strong>Content:</strong> {submission.content || "No content submitted."}</p>
                    <p><strong>Submitted At:</strong> {submission.submissionDate ? format(submission.submissionDate, "dd/MM/yyyy HH:mm") : "-"}</p>
                    <p><strong>Grade:</strong> {submission.submissionScore ?? "-"} / {taskScore}</p>
                </div>

            </DialogContent>
        </Dialog>
    );
};
