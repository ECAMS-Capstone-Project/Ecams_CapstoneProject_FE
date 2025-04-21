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
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { format, formatDate } from "date-fns";
import { EventSubmissionTaskDetail, GradeStudentTaskAPI, SubmissionReviewDTO } from "@/api/club-owner/TaskAPI";
import EventTaskBreadcrumb from "./EventTaskBreadcrumb";
import { EventTaskDetail } from "@/models/InterTask";
import parse from "html-react-parser";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import useAuth from "@/hooks/useAuth";
import { Grid2 } from "@mui/material";

const ViewTaskSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskDetail = location.state.taskDetail as EventTaskDetail;
  const submission = location.state.submission as EventSubmissionTaskDetail;
  const [feedback, setFeedback] = useState<string>(submission?.comment ?? "");
  const { user } = useAuth();

  const deadline = taskDetail.deadline;
  const isSubmitted = submission.submissionDate !== "0001-01-01T00:00:00" || (submission.studentSubmission != null || "");

  const isDeadlinePassed = deadline
    ? new Date(deadline).getTime() < Date.now()
    : false;
  const isAllowedToReviewAsZero = !isSubmitted && isDeadlinePassed;

  const hasFeedback =
    submission.comment !== null && submission.comment !== "" && feedback != "";

  const [score, setScore] = useState<number>(submission?.submissionScore ?? 0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveScore = async () => {
    if (!isSubmitted && !isAllowedToReviewAsZero) {
      alert("Không thể chấm điểm vì học sinh chưa nộp bài và chưa quá hạn.");
      return;
    }

    if (score === null || score < 0 || score > 10) {
      toast.error(`Điểm phải từ 0 đến 10`);
      return;
    }

    if (!user) return;

    const data: SubmissionReviewDTO = {
      clubMemberId: submission.clubMemberId,
      comment: feedback,
      eventTaskDetailId: taskDetail.eventTaskDetailId,
      reviewedBy: user.userId,
      submissionScore: score
    }

    try {
      setIsSaving(true)
      await GradeStudentTaskAPI(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
      toast.success("Submit successfully")
      window.history.back();
    }
  };

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
                  {taskDetail?.detailName}
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
                      "dd/MM/yyyy - HH:MM a"
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
                      "dd/MM/yyyy - HH:MM a"
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
                10
              </Badge>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-blue-500 flex items-center gap-2">
              <CheckCircle2 size={18} />
              Submission
            </h2>
          </div>
          <Separator />
          {isSubmitted ? (
            <Grid2 container>
              <Grid2 size={{ xs: 12, md: 9.5 }}>
                <div className="space-y-2 text-gray-700" style={{ width: "80%" }}>
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
                  <p className="pl-4">
                    {parse(submission.studentSubmission || "")}
                  </p>
                </div>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 2.5 }}>
                {submission?.submissionFile &&
                  submission?.submissionFile.length > 0 && (
                    <div className="border border-[#136CB9]/20 rounded-lg p-4 w-full">
                      <div className="flex flex-wrap align-middle sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                        <h3 className="font-semibold text-[#136CB9] flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Attachment
                        </h3>
                        <Button
                          onClick={handleDownloadAll}
                          variant="custom"
                          className="whitespace-nowrap text-xs sm:text-sm"
                        >
                          Download All
                        </Button>
                      </div>

                      <div className="bg-gradient-to-br from-[#136CB9]/5 to-[#49BBBD]/5 p-4 rounded-lg">
                        {submission?.submissionFile.map((fileUrl, index) => (
                          <div key={index} className="mb-2">
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
              </Grid2>
            </Grid2>
          ) : (
            <div className="text-yellow-700 flex items-center gap-2">
              <AlertTriangle size={20} />
              Not submitted.
            </div>
          )}
        </CardContent>
        <CardContent className="p-6 pt-3 space-y-4">
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

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Feedback:
                </p>
                {hasFeedback ? (
                  <div className="border border-gray-200 bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                    {submission.comment}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-5">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Score the task (up to 10 points)
                      </p>
                      <Input
                        type="number"
                        placeholder={`Enter score (max 10 points)`}
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
                    <textarea
                      placeholder="Fill in feedback"
                      disabled={!(isSubmitted || isAllowedToReviewAsZero)}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 p-2 text-sm"
                      rows={4}
                    />
                  </>
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
        {(hasFeedback && isSubmitted) || (!isSubmitted) ? (
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
