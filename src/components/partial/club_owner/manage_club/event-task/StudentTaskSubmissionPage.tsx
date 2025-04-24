import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, CheckCircle2, Pencil, ArrowLeft, CircleDot, UserRound } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EventTaskBreadcrumb from "./EventTaskBreadcrumb";
import { EventTaskDetail } from "@/models/InterTask";
import { EventSubmissionTaskDetail, SubmitTaskByStudent } from "@/api/club-owner/TaskAPI";
import toast from "react-hot-toast";
import parse from "html-react-parser";
import LoadingAnimation from "@/components/ui/loading";

const StudentTaskSubmissionPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const taskDetail = location.state.taskDetail as EventTaskDetail;
    const submission = location.state.submission as EventSubmissionTaskDetail;

    const [content, setContent] = useState(submission.studentSubmission || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const deadline = new Date(taskDetail.deadline);
    const now = new Date();
    const hasSubmitted = submission.submissionDate !== "0001-01-01T00:00:00";
    const isDeadlineOver = now > deadline;

    const hasFeedback = submission.comment !== null && submission.comment !== "";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };


    const handleSubmit = async () => {
        if (!content.trim()) {
            toast.error("Please enter your submission content.");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("ListSubmissions", file);
        });

        setIsSubmitting(true);
        try {
            await SubmitTaskByStudent(submission.clubMemberId, taskDetail.eventTaskDetailId, content, formData);
            setIsSubmitting(false);
            toast.success("Submit successfully")
            window.history.back();
        } catch (err) {
            console.error(err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-full mx-auto space-y-6">
            <EventTaskBreadcrumb
                items={[
                    { label: "Event List" },
                    { label: "Task List in Event" },
                    { label: "Sub Task List" },
                    { label: "Task Detail" },
                    { label: "Submission" }
                ]}
            />

            {/* Task Info */}
            <Card className="shadow-md bg-blue-50">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#136cb9]" />
                        </button>
                        <h1 className="text-2xl font-bold text-blue-600">{taskDetail?.detailName}</h1>
                    </div>
                    <p>{taskDetail?.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <p className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-muted-foreground" />
                            <span>
                                <strong>Start date:</strong> {new Date(taskDetail.startTime).toLocaleString()}
                            </span>
                        </p>
                        <p className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-muted-foreground" />
                            <span>
                                <strong>Deadline:</strong> {deadline.toLocaleString()}
                            </span>
                        </p>
                        <p className="flex items-center gap-2">
                            <UserRound size={16} className="text-muted-foreground" />
                            <span>
                                <strong>Review by:</strong> {submission.reviewer ? `${submission.reviewer.fullname}` : "Not yet"}
                            </span>
                        </p>
                        <p className="flex items-center gap-2">
                            <CircleDot size={16} className="text-muted-foreground" />
                            <strong> Your score:</strong>{" "}
                            <Badge className="bg-green-100 text-green-700 text-base">{submission.submissionScore} / 10</Badge>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Submission Section */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                        <Pencil size={18} />
                        {hasSubmitted ? "Submitted Task" : "Submit Your Task"}
                    </h2>
                    <Separator />

                    {hasSubmitted ? (
                        <div className="space-y-3 text-gray-700">
                            <p className="flex items-center gap-2 pb-2">
                                <CheckCircle2 size={16} />
                                <strong>Submitted on:</strong> {new Date(submission.submissionDate).toLocaleString()}
                            </p>
                            <div>
                                <strong className="text-blue-600">Your Submission:</strong>
                                <div
                                    className="prose border mt-2 p-4 bg-white rounded"
                                >
                                    {parse(submission.studentSubmission || "")}
                                </div>
                            </div>
                            {hasFeedback && (
                                <div className="border-t pt-4">
                                    <strong className="block text-blue-600">Feedback from reviewer:</strong>
                                    <div className="prose border mt-2 p-4 bg-yellow-50 rounded">
                                        {submission.comment}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : isDeadlineOver ? (
                        <div>
                            <p className="text-red-500 font-semibold">The deadline has passed. You can not submit.</p>
                            {hasFeedback && (
                                <div className="border-t pt-4">
                                    <strong className="block text-blue-600">Feedback from Reviewer:</strong>
                                    <div className="prose border mt-2 p-4 bg-yellow-50 rounded">
                                        {submission.comment}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={{
                                    toolbar: [
                                        ['bold', 'italic', 'underline'],
                                        ['link', 'image', 'video'],
                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                    ],
                                }}
                                className="bg-white"
                            />
                            <div className="space-y-2 mt-2">
                                <label className="font-semibold">Attach files</label>

                                {/* Custom File Upload */}
                                <div className="relative w-fit">
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
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>

                                {/* List of Selected Files */}
                                {files.length > 0 && (
                                    <ul className="ml-2 space-y-2">
                                        {files.map((file, index) => (
                                            <li key={index} className="flex items-center gap-4">
                                                {file.type.startsWith("image/") && (
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`preview-${index}`}
                                                        className="w-16 h-16 object-cover rounded border"
                                                    />
                                                )}
                                                <span className="text-sm text-gray-700">{file.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
                                    {isSubmitting ? <LoadingAnimation /> : "Submit"}
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentTaskSubmissionPage;
