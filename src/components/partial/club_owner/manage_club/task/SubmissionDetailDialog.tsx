import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grid2, TextField } from "@mui/material";
import { format } from "date-fns";
export interface StudentSubmission {
    submissionId: number;
    studentId: number;
    studentName: string;
    submittedAt: string;     // hoặc Date
    submissionText: string;  // Nội dung bài nộp
    grade: number | null;
    feedback: string | null; // Nếu null => chưa có feedback
}

interface SubmissionDetailDialogProps {
    submission: StudentSubmission;
    open: boolean;
    onClose: () => void;
    onSaveFeedback: (submissionId: number, newFeedback: string) => void;
}

const SubmissionDetailDialog: React.FC<SubmissionDetailDialogProps> = ({
    submission,
    open,
    onClose,
    onSaveFeedback,
}) => {
    // Lưu feedback tạm trước khi bấm Save
    const [tempFeedback, setTempFeedback] = useState(submission.feedback ?? "");

    // Nếu đã có feedback => read-only
    const hasFeedback = submission.feedback !== null;

    const handleSave = () => {
        onSaveFeedback(submission.submissionId, tempFeedback);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg p-0 overflow-hidden rounded-lg shadow-lg">
                {/* Phần đầu */}
                <DialogHeader className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Submission Detail
                    </DialogTitle>
                </DialogHeader>

                {/* Phần nội dung */}
                <div className="px-6 py-4">
                    {/* Thông tin chung */}
                    <div className="space-y-3 text-sm">
                        <Grid2 container mb={2}>
                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <span className="font-medium text-gray-600">Student Name:</span>{" "}
                                <span className="text-gray-800 font-semibold">
                                    {submission.studentName}
                                </span>
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <span className="font-medium text-gray-600">Submitted At:</span>{" "}
                                <span className="text-gray-800">{format(submission.submittedAt, 'HH:mm - dd/mm/yyyy')}</span>
                            </Grid2>
                        </Grid2>
                        <Grid2 container>
                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <span className="font-medium text-gray-600">Grade:</span>{" "}
                                <span className="text-gray-800 font-semibold">
                                    {submission.grade || "Not yet"}
                                </span>
                            </Grid2>
                        </Grid2>
                    </div>

                    {/* Nội dung bài nộp */}
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600 mb-1">Submission Content:</p>
                        <div className="border border-gray-200 bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                            {/* Cuộn nếu quá dài */}
                            <ScrollArea className="max-h-40">
                                <p className="whitespace-pre-wrap text-justify">{submission.submissionText}</p>
                            </ScrollArea>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600 mb-1">Feedback:</p>
                        {hasFeedback ? (
                            // Đã có feedback => chỉ đọc
                            <div className="border border-gray-200 bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                                {submission.feedback}
                            </div>
                        ) : (
                            <TextField
                                placeholder="Fill in feedback"
                                multiline
                                onChange={(e) => setTempFeedback(e.target.value)}
                                fullWidth
                                rows={3}
                            />
                        )}
                    </div>
                </div>

                {/* Phần footer */}
                <DialogFooter className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end space-x-2">
                    {hasFeedback ? (
                        // Nếu đã có feedback => chỉ có nút Close
                        <Button variant="secondary" onClick={onClose}>
                            Close
                        </Button>
                    ) : (
                        // Nếu chưa có => Save hoặc Cancel
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
