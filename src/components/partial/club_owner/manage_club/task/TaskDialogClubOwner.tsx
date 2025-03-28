/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
// UI Table components của shadcn
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SubmissionDetailDialog from "./SubmissionDetailDialog";
import {
  GetTaskDetail,
  GetMemberSubmission,
  ReviewSubmissionRequest,
  SendReviewSubmission,
  StudentSubmission,
  TaskDetailDTO
} from "@/api/club-owner/TaskAPI";
import { Task } from "@/models/Task";
import { Grid2 } from "@mui/material";
import toast from "react-hot-toast";

interface TaskDialogClubOwnerProps {
  initialData: Task;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskDialogClubOwner: React.FC<TaskDialogClubOwnerProps> = ({ initialData, setFlag }) => {
  // State cho chi tiết task (được load ngay khi component mount)
  const [taskDetail, setTaskDetail] = useState<TaskDetailDTO | null>(null);
  // State cho danh sách submissions (chỉ load khi người dùng bấm nút)
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  // Flag hiển thị bảng submissions
  const [showSubmissions, setShowSubmissions] = useState(false);

  // State để đánh dấu đã cache submissions (để tránh gọi API lại nếu đã load)
  const [submissionsLoaded, setSubmissionsLoaded] = useState(false);

  // State để mở dialog chi tiết submission
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // Load chi tiết task ngay khi component mount (chỉ dựa trên initialData.taskId)
  useEffect(() => {
    if (!initialData.taskId) return;
    async function fetchTaskDetail() {
      try {
        const response = await GetTaskDetail(initialData.taskId);
        if (response.data) {
          setTaskDetail(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch task detail", error);
      }
    }
    fetchTaskDetail();
  }, [initialData.taskId]);

  // Hàm load submissions, nếu đã cache (submissionsLoaded) thì chỉ set showSubmissions
  const handleLoadSubmissions = async () => {
    if (!initialData.taskId) return;
    if (submissionsLoaded) {
      setShowSubmissions(true);
      return;
    }
    try {
      const response = await GetMemberSubmission(initialData.taskId);
      if (response.data) {
        setSubmissions(response.data.data ?? []);
        setSubmissionsLoaded(true);
        setShowSubmissions(true);
      }
    } catch (error) {
      console.error("Failed to fetch student submissions", error);
    }
  };

  // Sử dụng useEffect để refresh submissions nếu cần (ví dụ khi setFlag thay đổi)
  // Nếu bạn có 1 flag để refresh, bạn có thể làm như sau:
  useEffect(() => {
    if (submissionsLoaded) {
      handleLoadSubmissions();
    }
  }, [setFlag]);

  // Khi lưu feedback cho submission, gọi API rồi refresh danh sách submissions (và cập nhật cache)
  const handleSaveFeedback = async (data: ReviewSubmissionRequest) => {
    try {
      await SendReviewSubmission(data);
      toast.success("Feedback sent successfully");
      // Sau khi gửi feedback, reload submissions để cập nhật giao diện và cache lại dữ liệu mới
      const response = await GetMemberSubmission(initialData.taskId);
      if (response.data) {
        setSubmissions(response.data.data ?? []);
        setSubmissionsLoaded(true);
      }
    } catch (error) {
      console.error("Failed to send feedback", error);
    }
  };

  // Mở dialog xem chi tiết submission
  const handleViewSubmission = (sub: StudentSubmission) => {
    setSelectedSubmission(sub);
    setOpenDetailDialog(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Task Detail</h2>
      {taskDetail ? (
        <div className="space-y-4 mb-6">
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <div className="flex flex-col">
                <label className="font-bold">Task Name:</label>
                <div className="p-2 bg-gray-100 border border-gray-300 rounded">
                  {taskDetail.taskName}
                </div>
              </div>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <div className="flex flex-col">
                <label className="font-bold">Description:</label>
                <div className="p-2 bg-gray-100 border border-gray-300 rounded">
                  {taskDetail.description}
                </div>
              </div>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <div className="flex flex-col">
                <label className="font-bold">Start Time:</label>
                <div className="p-2 bg-gray-100 border border-gray-300 rounded">
                  {taskDetail.startTime
                    ? format(new Date(taskDetail.startTime), "HH:mm dd/MM/yyyy")
                    : "Unknown"}
                </div>
              </div>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <div className="flex flex-col">
                <label className="font-bold">Deadline:</label>
                <div className="p-2 bg-gray-100 border border-gray-300 rounded">
                  {taskDetail.deadline
                    ? format(new Date(taskDetail.deadline), "HH:mm dd/MM/yyyy")
                    : "Unknown"}
                </div>
              </div>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <div className="flex flex-col">
                <label className="font-bold">Task Score:</label>
                <div className="p-2 bg-gray-100 border border-gray-300 rounded">
                  {taskDetail.taskScore ? `${taskDetail.taskScore} points` : "Unknown"}
                </div>
              </div>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <div className="flex flex-col">
                <label className="font-bold">Status:</label>
                <div className="p-2 bg-gray-100 border border-gray-300 rounded">
                  {taskDetail.status ? (
                    <span className="text-[#3a8f5e] font-bold">Completed</span>
                  ) : (
                    <span className="text-[#007BFF] font-bold">In progress</span>
                  )}
                </div>
              </div>
            </Grid2>
          </Grid2>
        </div>
      ) : (
        <p>Loading task details...</p>
      )}

      {/* Nút để load và hiển thị danh sách student submissions */}
      <div className="mb-4">
        {!showSubmissions && (
          <Button onClick={handleLoadSubmissions} variant="outline">
            View Student Submissions
          </Button>
        )}
      </div>

      {showSubmissions && submissions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Student Submissions</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((sub, index) => (
                <TableRow key={index}>
                  <TableCell>{sub.memberName}</TableCell>
                  <TableCell>{sub.submissionDate == '0001-01-01T00:00:00' ? "Haven't submitted " : format(sub.submissionDate, "HH:mm - dd/MM/yyyy")}</TableCell>
                  <TableCell>{sub.submissionScore ? `${sub.submissionScore} points` : "-"}</TableCell>
                  <TableCell style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button variant="outline" onClick={() => handleViewSubmission(sub)}>
                      View / Comment
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog chi tiết submission */}
      {selectedSubmission && (
        <SubmissionDetailDialog
          submission={selectedSubmission}
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          onSaveFeedback={handleSaveFeedback}
          taskScore={taskDetail ? taskDetail.taskScore : 0}
        />
      )}
    </div>
  );
};

export default TaskDialogClubOwner;
