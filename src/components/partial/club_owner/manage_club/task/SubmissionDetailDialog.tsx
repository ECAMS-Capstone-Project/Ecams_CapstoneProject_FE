import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grid2 } from "@mui/material";
import { format } from "date-fns";
import { ReviewSubmissionRequest, SendStudentSubmission, Submission } from "@/api/club-owner/TaskAPI";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface SubmissionDetailDialogProps {
    submission: Submission;
    open: boolean;
    onClose: () => void;
    onSaveFeedback: (data: ReviewSubmissionRequest) => void;
    taskScore: number;
    isSubmitting: boolean
    deadline: string | null;
    setFlag?: React.Dispatch<React.SetStateAction<boolean>>
}

const SubmissionDetailDialog: React.FC<SubmissionDetailDialogProps> = ({
    submission,
    open,
    onClose,
    onSaveFeedback,
    taskScore,
    isSubmitting,
    deadline,
    setFlag
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [ownerSubmissionContent, setOwnerSubmissionContent] = useState("");
    const { user } = useAuth();
    const [tempFeedback, setTempFeedback] = useState(submission.comment ?? "");
    const [tempScore, setTempScore] = useState<number>(submission.submissionScore ?? 0);

    const hasFeedback = submission.comment !== null && submission.comment !== "";
    const isOwnerSelfTask = submission?.memberEmail === user?.email && submission.submissionDate == "0001-01-01T00:00:00";

    const handleDownloadAll = async () => {
        if (
            submission?.submissionFile &&
            submission.submissionFile.length > 0
        ) {
            const zip = new JSZip();

            const fetchPromises = submission.submissionFile.map(async (fileUrl) => {
                const fileName = fileUrl.split("/").pop();
                try {
                    const response = await fetch(fileUrl);
                    const blob = await response.blob();
                    if (fileName) {
                        zip.file(fileName, blob);
                    }
                } catch (error) {
                    console.error("Error downloading file:", error);
                }
            });

            await Promise.all(fetchPromises);

            zip.generateAsync({ type: "blob" }).then((content) => {
                saveAs(content, "submission_files.zip");
            });
        }
    };
    useEffect(() => {
        setTempScore(0)
    }, [])
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSave = async () => {
        if (isOwnerSelfTask) {
            if (ownerSubmissionContent.trim() === "") {
                toast.error("Submission content cannot be empty");
                return;
            }
            const fileNames: string[] = files.map(file => file.name);
            const data = {
                taskId: submission.taskId,
                clubMemberId: submission.clubMemberId,
                studentSubmission: ownerSubmissionContent,
                listSubmissions: fileNames
            };
            await SendStudentSubmission(data);
            if (setFlag) {
                setFlag(pre => !pre);
            }
            toast.success("Submission sent successfully!");
            onClose();
        }
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

    const isSubmitted = submission.submissionDate != "0001-01-01T00:00:00"

    const isDeadlinePassed = deadline ? new Date(deadline).getTime() < Date.now() : false;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl p-0 overflow-hidden rounded-lg shadow-lg">
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
                                <span className="text-gray-800 font-semibold">
                                    {!isSubmitted ? "Haven't submitted " : format(submission.submissionDate, "HH:mm - dd/MM/yyyy")}
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
                            <ScrollArea className="max-h-40 overflow-y-auto">
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
                    {isOwnerSelfTask && !isSubmitted && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-600 mb-1">Submit your answer:</p>
                            <textarea
                                placeholder="Enter your answer"
                                value={ownerSubmissionContent}
                                onChange={(e) => setOwnerSubmissionContent(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 p-2 text-sm"
                                rows={3}
                            ></textarea>
                            <div className="relative w-fit mt-3">
                                <label
                                    htmlFor="customFileUpload"
                                    className="cursor-pointer inline-block file:mr-4 py-2 px-4 rounded bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 border border-blue-400"
                                >
                                    Choose Files
                                </label>
                                <input
                                    id="customFileUpload"
                                    type="file"
                                    multiple
                                    lang="en"
                                    accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                />
                                <div className="mt-2 text-sm text-gray-700">
                                    {files.map((file, index) => (
                                        <div key={index}>
                                            {index + 1}. {file.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Feedback and Score */}
                    <div className="mt-4 space-y-4">
                        {(!hasFeedback && (!isSubmitted)) && (
                            <div>
                                {isDeadlinePassed && (
                                    <p className="text-sm text-orange-500 font-medium mb-2">
                                        ⚠️ This student missed the deadline and has not submitted. You may grade with 0 and leave feedback.
                                    </p>
                                )}
                            </div>
                        )}
                        <div>
                            {hasFeedback ? (
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Feedback:</p>
                                    <div className="border border-gray-200 bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                                        {submission.comment}
                                    </div>
                                </div>
                            ) : !(hasFeedback || !(isSubmitted || isDeadlinePassed) ? (
                                <>
                                    <p className="text-sm font-medium text-gray-600 mb-1 mt-2">
                                        Score the task (up to {taskScore} points)
                                    </p>
                                    <Input
                                        type="number"
                                        placeholder={`Enter score (max ${taskScore} points)`}
                                        value={tempScore}
                                        disabled={hasFeedback || !(isSubmitted || isDeadlinePassed)}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            if (value >= 0) {
                                                setTempScore(value);
                                            } else {
                                                toast.error("Please input correct conditions ")
                                            }
                                        }}
                                        className="w-full text-sm mb-3"
                                    />
                                    <textarea
                                        placeholder="Fill in feedback"
                                        disabled={hasFeedback || !(isSubmitted || isDeadlinePassed)}
                                        onChange={(e) => setTempFeedback(e.target.value)}
                                        className="block w-full rounded-md border border-gray-300 p-2 text-sm"
                                        rows={3}
                                    ></textarea>
                                </>
                            ) : (<div>

                            </div>))}
                        </div>
                    </div>
                    {submission?.submissionFile && submission?.submissionFile?.length > 0 && (
                        <div className="mt-4 flex justify-start">
                            <Button variant="default" onClick={handleDownloadAll}>
                                Download student submission file
                            </Button>
                        </div>
                    )}
                </div>
                {/* Footer */}
                <DialogFooter className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end space-x-2">
                    {((hasFeedback || isSubmitted || isDeadlinePassed || !isSubmitted) && (!isOwnerSelfTask)) ? (
                        <Button variant="secondary" onClick={onClose}>
                            Close
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={16} />
                                        Saving...
                                    </span>
                                ) : (
                                    "Save"
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SubmissionDetailDialog;
