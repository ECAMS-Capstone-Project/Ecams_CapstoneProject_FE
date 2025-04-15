import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, FileText, User2, Clock, CheckCircle2, PencilLine } from "lucide-react";
import { Input } from "@/components/ui/input";

const ViewTaskSubmissionPage: React.FC = () => {
    const navigate = useNavigate();

    const taskDetail = {
        taskName: "Viết bài luận về môi trường",
        startDate: new Date("2025-04-10T08:00:00"),
        endDate: new Date("2025-04-20T23:59:59"),
        description:
            "Viết một bài luận ngắn (300 từ) trình bày quan điểm của bạn về vấn đề ô nhiễm môi trường.",
        taskScore: 10,
        submissions: [
            {
                memberName: "Nguyễn Văn A",
                submissionDate: "2025-04-18T20:15:00",
                submissionScore: null, // Bài này chưa chấm điểm
                content:
                    "Tôi cho rằng vấn đề ô nhiễm môi trường đang ngày càng nghiêm trọng...",
            },
        ],
    };

    const submission = taskDetail.submissions?.[0];
    const hasSubmitted =
        submission &&
        submission.submissionDate &&
        submission.submissionDate !== "0001-01-01T00:00:00";

    // Chấm điểm state
    const [score, setScore] = useState<number | null>(submission?.submissionScore ?? null);
    const [feedback, setFeedback] = useState<string>("");  // feedback state
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"submission" | "grading">("submission"); // tab state

    const handleSaveScore = () => {
        if (score !== null && (score < 0 || score > taskDetail.taskScore)) {
            alert(`Điểm phải từ 0 đến ${taskDetail.taskScore}`);
            return;
        }

        setIsSaving(true);
        // Giả lập lưu (sau này bạn gọi API ở đây)
        setTimeout(() => {
            console.log("✅ Điểm và Feedback đã được lưu:", score, feedback);
            setIsSaving(false);
            alert("Đã lưu điểm và feedback thành công!");
        }, 1000);
    };

    return (
        <div className="p-6 max-w-full mx-auto space-y-6 rounded-md border border-gray-300 shadow-lg">
            {/* Task Info */}
            <Card className="bg-blue-100">
                <CardContent className="p-6 space-y-4">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <FileText size={20} />
                        {taskDetail.taskName}
                    </h1>

                    <div className="text-gray-700 space-y-2">
                        <p className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-muted-foreground" />
                            <span>
                                <strong>Bắt đầu:</strong>{" "}
                                {new Date(taskDetail.startDate).toLocaleString()}
                            </span>
                        </p>
                        <p className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-muted-foreground" />
                            <span>
                                <strong>Kết thúc:</strong>{" "}
                                {new Date(taskDetail.endDate).toLocaleString()}
                            </span>
                        </p>
                        <p>
                            <strong>Mô tả:</strong> {taskDetail.description}
                        </p>
                        <p>
                            <strong>Điểm tối đa:</strong>{" "}
                            <Badge className="bg-green-100 text-green-700">
                                {taskDetail.taskScore}
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
                    Bài nộp
                </Button>
                <Button
                    variant={activeTab === "grading" ? "default" : "ghost"}
                    onClick={() => setActiveTab("grading")}
                >
                    Chấm điểm
                </Button>
            </div>

            {/* Submission Info */}
            {activeTab === "submission" && (
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-blue-500 flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            Bài nộp
                        </h2>
                        <Separator />
                        {hasSubmitted ? (
                            <div className="space-y-2 text-gray-700">
                                <p className="flex items-center gap-2">
                                    <User2 size={16} />
                                    <span>
                                        <strong>Thành viên:</strong> {submission.memberName}
                                    </span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>
                                        <strong>Ngày nộp:</strong>{" "}
                                        {new Date(submission.submissionDate).toLocaleString()}
                                    </span>
                                </p>

                                <p>
                                    <strong>Nội dung:</strong> {submission.content}
                                </p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">Chưa có bài nộp nào.</p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Grading Tab */}
            {activeTab === "grading" && (
                <Card className="bg-gray-100">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-blue-500 flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            Chấm điểm
                        </h2>
                        <Separator />
                        {hasSubmitted && (
                            <div className="space-y-2 text-gray-700">
                                <div className="flex items-center gap-2">
                                    <strong>Điểm:</strong>
                                    {score !== null ? (
                                        <Badge
                                            variant="outline"
                                            className="text-green-600 border-green-300"
                                        >
                                            {score}
                                        </Badge>
                                    ) : (
                                        <span className="italic text-muted-foreground">Chưa chấm</span>
                                    )}
                                    <PencilLine size={16} className="text-muted-foreground" />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Input
                                        type="number"
                                        placeholder="Nhập điểm..."
                                        value={score ?? ""}
                                        onChange={(e) =>
                                            setScore(e.target.value === "" ? null : Number(e.target.value))
                                        }
                                        className="max-w-[100px]"
                                        min={0}
                                        max={taskDetail.taskScore}
                                    />
                                    <Button onClick={handleSaveScore} disabled={isSaving}>
                                        {isSaving ? "Đang lưu..." : "Lưu điểm"}
                                    </Button>
                                </div>

                                <div className="mt-4">
                                    <strong>Feedback:</strong>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className="w-full p-2 border rounded"
                                        placeholder="Nhập feedback..."
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-end">
                <Button onClick={() => navigate(-1)} variant="outline">
                    Quay lại
                </Button>
            </div>
        </div>
    );
};

export default ViewTaskSubmissionPage;
