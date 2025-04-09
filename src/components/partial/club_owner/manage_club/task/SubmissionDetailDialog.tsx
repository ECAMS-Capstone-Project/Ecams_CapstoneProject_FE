import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grid2 } from "@mui/material";
import { format } from "date-fns";
import { ReviewSubmissionRequest, Submission } from "@/api/club-owner/TaskAPI";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

interface SubmissionDetailDialogProps {
    submission: Submission;
    open: boolean;
    onClose: () => void;
    onSaveFeedback: (data: ReviewSubmissionRequest) => void;
    taskScore: number;
}

const SubmissionDetailDialog: React.FC<SubmissionDetailDialogProps> = ({
    submission,
    open,
    onClose,
    onSaveFeedback,
    taskScore,
}) => {
    const { user } = useAuth();
    // Lưu feedback tạm trước khi bấm Save
    const [tempFeedback, setTempFeedback] = useState(submission.comment ?? "");
    // Lưu điểm tạm (mặc định là submission.submissionScore nếu có, hoặc 0)
    const [tempScore, setTempScore] = useState<number>(submission.submissionScore ?? 0);

    // Nếu đã có feedback => read-only
    const hasFeedback = submission.comment !== null && submission.comment !== "";

    const handleSave = async () => {
        if (user) {
            // Validate: điểm nhập vào không được vượt quá taskScore
            if (tempScore > taskScore) {
                toast.error(`Score must be equal to or less than task score (${taskScore} points).`);
                return;
            }
            const reviewBody: ReviewSubmissionRequest = {
                taskId: submission.taskId,
                clubMemberId: submission.clubMemberId,
                comment: tempFeedback,
                submissionScore: tempScore,
                reviewedBy: user.userId,
            };
            onSaveFeedback(reviewBody);
            onClose();
        }
    };

    const isSubmitted = submission.submissionDate == "0001-01-01T00:00:00"

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg p-0 overflow-hidden rounded-lg shadow-lg">
                {/* Header */}
                <DialogHeader className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Submission Detail
                    </DialogTitle>
                </DialogHeader>

                {/* Content */}
                <div className="px-6 py-4">
                    {/* General Information */}
                    <div className="space-y-3 text-sm">
                        <Grid2 container mb={2}>
                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <span className="font-medium text-gray-600">Student Name:</span>{" "}
                                <span className="text-gray-800 font-semibold">{submission.memberName}</span>
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <span className="font-medium text-gray-600">Submitted At:</span>{" "}
                                <span className="text-gray-800">
                                    {isSubmitted ? "Haven't submitted " : format(submission.submissionDate, "HH:mm - dd/MM/yyyy")}
                                </span>
                            </Grid2>
                        </Grid2>
                        <Grid2 container>
                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <span className="font-medium text-gray-600">Grade:</span>{" "}
                                <span className="text-gray-800 font-semibold">
                                    {submission.submissionScore ? `${submission.submissionScore} points` : "Not yet"}
                                </span>
                            </Grid2>
                        </Grid2>
                    </div>

                    {/* Submission Content */}
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600 mb-1">Submission Content:</p>
                        <div className="border border-gray-200 bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                            <ScrollArea className="max-h-40">
                                <p className="whitespace-pre-wrap text-justify">
                                    {
                                        submission.studentSubmission
                                            ? submission.studentSubmission
                                                .replace(/<\/p>\s*/gi, "\n")
                                                .replace(/<[^>]+>/g, "")
                                                .trim()
                                            : "Student hasn't submitted"
                                    }
                                </p>
                            </ScrollArea>
                        </div>
                    </div>

                    {/* Feedback and Score */}
                    <div className="mt-4 space-y-4">
                        {!hasFeedback && (
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Score {"<="} {taskScore} points
                                </p>
                                <Input
                                    type="number"
                                    disabled={isSubmitted}
                                    placeholder={`Enter score (max ${taskScore} points)`}
                                    value={tempScore}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value >= 0 && value <= taskScore) {
                                            setTempScore(value);
                                        } else {
                                            toast.success("Invalid Input")
                                        }
                                    }}
                                    className="w-full text-sm"
                                />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Feedback:</p>
                            {hasFeedback ? (
                                <div className="border border-gray-200 bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                                    {submission.comment}
                                </div>
                            ) : (
                                <textarea
                                    disabled={isSubmitted}
                                    placeholder="Fill in feedback"
                                    onChange={(e) => setTempFeedback(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 p-2 text-sm"
                                    rows={3}
                                ></textarea>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end space-x-2">
                    {hasFeedback || isSubmitted ? (
                        <Button variant="secondary" onClick={onClose}>
                            Close
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SubmissionDetailDialog;
