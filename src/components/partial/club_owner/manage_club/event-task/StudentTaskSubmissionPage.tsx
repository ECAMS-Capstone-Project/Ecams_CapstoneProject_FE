import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, FileText, CheckCircle2, Pencil } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const StudentTaskSubmissionPage: React.FC = () => {
    const navigate = useNavigate();

    const taskDetail = {
        taskName: "Viết bài luận về môi trường",
        startDate: new Date("2025-04-10T08:00:00"),
        endDate: new Date("2025-04-20T23:59:59"),
        description: "Viết một bài luận ngắn (300 từ) trình bày quan điểm của bạn về vấn đề ô nhiễm môi trường.",
        taskScore: 10,
        submission: {
            submissionDate: "", // để kiểm tra nếu đã nộp hay chưa
            content: "", // nội dung bài nộp nếu có
        },
    };

    const [content, setContent] = useState(taskDetail.submission.content || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasSubmitted = !!taskDetail.submission.submissionDate;
    const deadline = new Date(taskDetail.endDate);
    const now = new Date();
    const isDeadlineOver = now > deadline;

    const handleSubmit = () => {
        if (!content || content.trim() === "") {
            alert("Vui lòng nhập nội dung bài nộp.");
            return;
        }

        setIsSubmitting(true);

        // Giả lập gửi bài
        setTimeout(() => {
            console.log("✅ Bài đã được gửi:", content);
            setIsSubmitting(false);
            alert("Đã nộp bài thành công!");
        }, 1000);
    };

    return (
        <div className="p-6 max-w-full mx-auto space-y-6 rounded-md border border-gray-300 shadow-lg">
            {/* Task Info */}
            <Card className="bg-blue-100">
                <CardContent className="p-6 space-y-4">
                    <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                        <FileText size={20} />
                        {taskDetail.taskName}
                    </h1>

                    <div className="text-gray-700 space-y-2">
                        <p className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-muted-foreground" />
                            <span>
                                <strong>Bắt đầu:</strong> {taskDetail.startDate.toLocaleString()}
                            </span>
                        </p>
                        <p className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-muted-foreground" />
                            <span>
                                <strong>Kết thúc:</strong> {deadline.toLocaleString()}
                            </span>
                        </p>
                        <p>
                            <strong>Mô tả:</strong> {taskDetail.description}
                        </p>
                        <p>
                            <strong>Điểm tối đa:</strong>{" "}
                            <Badge className="bg-green-100 text-green-700">{taskDetail.taskScore}</Badge>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Submission Form */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                        <Pencil size={18} />
                        {hasSubmitted ? "Bài đã nộp" : "Nộp bài"}
                    </h2>
                    <Separator />

                    {hasSubmitted ? (
                        <div className="space-y-3 text-gray-700">
                            <p className="flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                <strong>Đã nộp vào:</strong> {new Date(taskDetail.submission.submissionDate).toLocaleString()}
                            </p>
                            <div>
                                <strong>Nội dung bài nộp:</strong>
                                <div
                                    className="prose border mt-2 p-4 bg-white rounded"
                                    dangerouslySetInnerHTML={{ __html: taskDetail.submission.content }}
                                />
                            </div>
                        </div>
                    ) : isDeadlineOver ? (
                        <p className="text-red-500 font-semibold">Đã quá hạn nộp bài. Bạn không thể nộp bài nữa.</p>
                    ) : (
                        <>
                            <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-white" />
                            <div className="flex justify-end">
                                <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
                                    {isSubmitting ? "Đang gửi..." : "Nộp bài"}
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </div>
        </div>
    );
};

export default StudentTaskSubmissionPage;
