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
  SquareChartGantt,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { format, formatDate } from "date-fns";
import { Submission, TaskDetailDTO } from "@/api/club-owner/TaskAPI";
import EventTaskBreadcrumb from "./EventTaskBreadcrumb";

const ViewTaskSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskDetail = location.state.taskDetail as TaskDetailDTO;
  const submission = location.state.submission as Submission;
  const [feedback, setFeedback] = useState<string>(submission?.comment ?? "");
    console.log(submission);
    
  const deadline = taskDetail.deadline;
  const isSubmitted = submission.submissionDate !== "0001-01-01T00:00:00" || submission.studentSubmission != "";

  const isDeadlinePassed = deadline
    ? new Date(deadline).getTime() < Date.now()
    : false;
  const isAllowedToReviewAsZero = !isSubmitted && isDeadlinePassed;

  const hasFeedback =
    submission.comment !== null && submission.comment !== "" && feedback != "";

  const [score, setScore] = useState<number>(submission?.submissionScore ?? 0);
  const [isSaving, setIsSaving] = useState(false);

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
    <div className="max-w-full mx-auto space-y-6 ">
      <EventTaskBreadcrumb
        items={[
          { label: "Event List" },
          { label: "Task list in event" },
          { label: "Sub task list in event" },
          { label: "Sub task detail" },
          { label: "Task submission" },
        ]}
      />
      <Card className="bg-blue-50 shadow-md">
        <CardContent className="py-6 space-y-4">
          <div>
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
              </div>
            </div>
            <p className="mt-1">{taskDetail?.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Start Time</p>
                <p>
                  {taskDetail?.startTime
                    ? format(
                        new Date(taskDetail.startTime),
                        "dd/MM/yyyy - hh:mm"
                      )
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
                    ? format(
                        new Date(taskDetail.deadline),
                        "dd/MM/yyyy - hh:mm"
                      )
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
                    <p className="text-sm font-medium text-[#007BFF]">
                      InActive
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Member assign
                </p>
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
                <strong>Member:</strong> {submission.memberName}
              </p>
              <p className="flex items-center gap-2">
                <Clock size={16} />
                <strong>Submit date:</strong>{" "}
                {formatDate(new Date(submission.submissionDate).toISOString(), "dd/MM/yyyy hh:mm")}
              </p>
              <p className="flex text-justify items-center gap-2">
                <SquareChartGantt size={16} />
                <strong> Content:</strong>
              </p>
              <p>
              {submission.studentSubmission}
              </p>
            </div>
          ) : (
            <div className="text-yellow-700 flex items-center gap-2">
              <AlertTriangle size={20} />
              Not submitted.
            </div>
          )}
        </CardContent>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-blue-500 flex items-center gap-2">
            <PencilLine size={18} />
            Grading
          </h2>
          <Separator />
          {isSubmitted ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <strong>Score:</strong>
                {score !== null ? (
                  <Badge className="text-green-600 border border-green-300">
                    {score}
                  </Badge>
                ) : (
                  <span className="italic text-muted-foreground">
                    Not scored
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
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
                      toast.error("Please input correct conditions ");
                    }
                  }}
                  className="w-1/4 text-sm"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Feedback:
                </p>
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
          ) : isAllowedToReviewAsZero ? (
            <p className="text-sm text-orange-500 font-medium mb-2 flex gap-2">
              <AlertTriangle size={20} />
              This student missed the deadline and has not submitted
            </p>
          ) : (
            <p className="text-muted-foreground italic flex gap-2">
              <AlertTriangle size={20} />
              Cannot grade because the student has not submitted the assignment
              and the deadline has not passed yet.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {!hasFeedback && !isSubmitted ? (
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
