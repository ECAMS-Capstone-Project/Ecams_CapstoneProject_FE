import React, { useEffect, useState } from "react";
import { format } from "date-fns";
// UI Table components của shadcn
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SubmissionDetailDialog from "./SubmissionDetailDialog";
import { GetMemberSubmission, GetTaskDetail, ReviewSubmissionRequest, SendReviewSubmission, StudentSubmission, TaskDetailDTO } from "@/api/club-owner/TaskAPI";
import { Task } from "@/models/Task";
import { Grid2 } from "@mui/material";
import toast from "react-hot-toast";

interface TaskDialogClubOwnerProps {
  initialData: Task;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskDialogClubOwner: React.FC<TaskDialogClubOwnerProps> = ({ initialData }) => {
  const [taskDetail, setTaskDetail] = useState<TaskDetailDTO | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);

  // State để mở dialog chi tiết submission (chỉ một submission, không phải mảng)
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // Fetch chi tiết task dựa trên taskId
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

  // Fetch danh sách student submissions dựa trên taskId
  useEffect(() => {
    if (!initialData.taskId) return;
    async function fetchSubmissions() {
      try {
        const response = await GetMemberSubmission(initialData.taskId);
        if (response.data) {
          setSubmissions(response.data.data ?? []);
        }
      } catch (error) {
        console.error("Failed to fetch student submissions", error);
      }
    }
    fetchSubmissions();
  }, [initialData.taskId]);

  // Khi club owner lưu feedback cho submission
  const handleSaveFeedback = async (data: ReviewSubmissionRequest) => {
    // Cập nhật state cục bộ (có thể gọi API nếu cần)
    await SendReviewSubmission(data);
    toast.success("Send feedback successfully")
    console.log(data);
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

      <div>
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
                <TableCell>{format(new Date(sub.submissionDate), "HH:mm - dd/MM/yyyy")}</TableCell>
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

      {/* Dialog chi tiết submission */}
      {selectedSubmission && (
        <SubmissionDetailDialog
          submission={selectedSubmission}
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          onSaveFeedback={handleSaveFeedback}
          taskScore={taskDetail!.taskScore}
        />
      )}
    </div>
  );
};

export default TaskDialogClubOwner;
