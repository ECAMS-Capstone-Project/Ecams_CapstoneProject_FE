import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    User2,
    Clock,
    CheckCircle2,
    PencilLine,
    AlertTriangle,
    Loader2,
    ArrowLeft,
    User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Submission, TaskDetailDTO } from "@/api/club-owner/TaskAPI";
import { fixTime } from "@/lib/utils";

const ViewTaskSubmissionPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const taskDetail = location.state.taskDetail as TaskDetailDTO;
    const submission = location.state.submission as Submission

    const deadline = taskDetail.deadline;
    const isSubmitted = submission.submissionDate !== "0001-01-01T00:00:00";

    const isDeadlinePassed = deadline ? new Date(deadline).getTime() < Date.now() : false;
    const isAllowedToReviewAsZero = !isSubmitted && isDeadlinePassed;

    const hasFeedback = submission.comment !== null && submission.comment !== "";

    const [score, setScore] = useState<number>(submission?.submissionScore ?? 0);
    const [feedback, setFeedback] = useState<string>(submission?.comment ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"submission" | "grading">("submission");

    const handleSaveScore = () => {
        if (!isSubmitted && !isAllowedToReviewAsZero) {
            alert("Không thể chấm điểm vì học sinh chưa nộp bài và chưa quá hạn.");
            return;
        }

        if (score === null || score < 0 || score > taskDetail.taskScore) {
            toast.error(`Điểm phải từ 0 đến ${taskDetail.taskScore}`);
            return;
        }

        setIsSaving(true);
        // Giả lập lưu
        setTimeout(() => {
            console.log("✅ Điểm và Feedback đã được lưu:", score, feedback);
            setIsSaving(false);
            alert("Đã lưu điểm và feedback thành công!");
        }, 1000);
    };
    return (
        <div className="p-6 max-w-full mx-auto space-y-6 rounded-md border border-gray-300 shadow-lg bg-white">
            <Card className="bg-blue-50 shadow-md">
                <CardContent className="py-6 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#136cb9]" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-blue-600">
                                {taskDetail?.taskName}
                            </h1>
                            <p className="mt-1 text-gray-700">{taskDetail?.description}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Start Time</p>
                                <p>
                                    {taskDetail?.startTime
                                        ? format(new Date(taskDetail.startTime), "dd/MM/yyyy - hh:mm")
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Deadline</p>
                                <p>
                                    {taskDetail?.deadline
                                        ? format(new Date(taskDetail.deadline), "dd/MM/yyyy - hh:mm")
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {taskDetail?.status ? (
                                <>
                                    <span className="w-5 h-5 rounded-full bg-green-500 inline-block" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Status</p>
                                        <p className="text-green-600 font-semibold">Active</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="w-5 h-5 rounded-full bg-[#D6E4FF] inline-block" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Status</p>
                                        <p className="text-sm font-medium text-[#007BFF]">InActive</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Member assign</p>
                                <p>{submission?.memberName ? submission?.memberName : "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-700">
                            <strong>Max score:</strong>{" "}
                            <Badge className="bg-green-100 text-green-700">
                                {taskDetail?.taskScore}
                            </Badge>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
                <Button
                    variant={activeTab === "submission" ? "default" : "ghost"}
                    onClick={() => setActiveTab("submission")}
                >
                    Submission
                </Button>
                <Button
                    variant={activeTab === "grading" ? "default" : "ghost"}
                    onClick={() => setActiveTab("grading")}
                >
                    Grading
                </Button>
            </div>

            {/* Submission */}
            {activeTab === "submission" && (
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-blue-500 flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            Submission
                        </h2>
                        <Separator />
                        {isSubmitted ? (
                            <div className="space-y-2 text-gray-700">
                                <p className="flex items-center gap-2">
                                    <User2 size={16} />
                                    <strong>Thành viên:</strong> {submission.memberName}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <strong>Ngày nộp:</strong>{" "}
                                    {fixTime(new Date(submission.submissionDate)).toString()}
                                </p>
                                <p>
                                    <strong>Nội dung:</strong> {submission.studentSubmission}
                                </p>
                            </div>
                        ) : (
                            <div className="text-yellow-700 flex items-center gap-2">
                                <AlertTriangle size={20} />
                                Not submitted.
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Grading */}
            {activeTab === "grading" && (
                <Card className="bg-gray-50">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-blue-500 flex items-center gap-2">
                            <PencilLine size={18} />
                            Grading
                        </h2>
                        <Separator />
                        {isSubmitted || isAllowedToReviewAsZero ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <strong>Score:</strong>
                                    {score !== null ? (
                                        <Badge className="text-green-600 border border-green-300">
                                            {score}
                                        </Badge>
                                    ) : (
                                        <span className="italic text-muted-foreground">Not scored</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    {(!hasFeedback && (isSubmitted || isAllowedToReviewAsZero)) && (
                                        <div>
                                            {isAllowedToReviewAsZero && (
                                                <p className="text-sm text-orange-500 font-medium mb-2">
                                                    ⚠️ This student missed the deadline and has not submitted. You may grade with 0 and leave feedback.
                                                </p>
                                            )}
                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                Score the task (up to {taskDetail.taskScore} points)
                                            </p>
                                            <Input
                                                type="number"
                                                placeholder={`Enter score (max ${taskDetail.taskScore} points)`}
                                                value={score}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (value >= 0) {
                                                        setScore(value);
                                                    } else {
                                                        toast.error("Please input correct conditions ")
                                                    }
                                                }}
                                                className="w-1/4 text-sm"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Feedback:</p>
                                    {hasFeedback ? (
                                        <div className="border border-gray-200 bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                                            {submission.comment}
                                        </div>
                                    ) : (
                                        <textarea
                                            placeholder="Fill in feedback"
                                            disabled={!(isSubmitted || isAllowedToReviewAsZero)}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            className="block w-full rounded-md border border-gray-300 p-2 text-sm"
                                            rows={4}
                                        ></textarea>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">
                                ⚠️ Cannot grade because the student has not submitted the assignment and the deadline has not passed yet.
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-end gap-3">
                {((!hasFeedback || !isSubmitted) && activeTab == "submission") ? (
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Close
                    </Button>
                ) : (
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveScore}>
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={16} />
                                    Saving...
                                </span>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewTaskSubmissionPage;
