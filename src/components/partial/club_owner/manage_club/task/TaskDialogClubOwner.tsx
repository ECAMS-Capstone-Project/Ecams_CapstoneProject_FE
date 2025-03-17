import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "react-quill/dist/quill.snow.css";
import { Task } from "@/models/Task";
import { format } from "date-fns";

// Các component UI shadcn
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import SubmissionDetailDialog, { StudentSubmission } from "./SubmissionDetailDialog";

interface TaskDetailDialogProps {
  initialData: Task | null;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskDialogClubOwner: React.FC<TaskDetailDialogProps> = ({ initialData }) => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);

  // State để mở dialog chi tiết submission
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // Giả sử status = boolean (true = completed)

  // Lấy form control
  const form = useForm<Task>({
    defaultValues: initialData || {
      taskName: "",
      description: "",
      deadline: "",
      status: false,
      startTime: ""
    },
  });

  // Fake load submissions (khi mount hoặc khi taskId thay đổi)
  useEffect(() => {
    if (!initialData?.taskId) return;

    // TODO: Gọi API thật để lấy submissions. Tạm fake:
    const fakeSubs: StudentSubmission[] = [
      {
        submissionId: 101,
        studentId: 501,
        studentName: "John Smith",
        submittedAt: "2025-03-02T10:15:00Z",
        submissionText: "Here is my assignment text. It's quite detailed. The period during which a TaskRun is valid. Unit: seconds. TaskRuns that exceed the validity period are deleted automatically. Additionally, TaskRuns in the FAILED and SUCCESS states are also deleted automatically. A TaskRun is an individual run of a periodic task. Here is my assignment text. It's quite detailed. The period during which a TaskRun is valid. Unit: seconds. TaskRuns that exceed the validity period are deleted automatically. Additionally, TaskRuns in the FAILED and SUCCESS states are also deleted automatically. A TaskRun is an individual run of a periodic task",
        grade: 5,
        feedback: null,
      },
      {
        submissionId: 102,
        studentId: 502,
        studentName: "Jane Doe",
        submittedAt: "2025-03-04T19:30:00Z",
        submissionText: "My assignment with some pictures included.",
        grade: 90,
        feedback: "Great job!",
      },
    ];
    setSubmissions(fakeSubs);
  }, [initialData?.taskId]);
  console.log(initialData);

  // Khi club owner lưu feedback
  const handleSaveFeedback = (submissionId: number, newFeedback: string) => {
    // Gọi API thật ở đây nếu có
    // Tạm thời chỉ update state cục bộ
    setSubmissions((prev) =>
      prev.map((s) =>
        s.submissionId === submissionId
          ? { ...s, feedback: newFeedback }
          : s
      )
    );
    console.log("Saved feedback for submission:", submissionId, newFeedback);
  };

  // Mở dialog xem chi tiết submission
  const handleViewSubmission = (sub: StudentSubmission) => {
    setSelectedSubmission(sub);
    setOpenDetailDialog(true);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Task Detail</h2>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Task Name (Read-only) */}
          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Name:</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    disabled
                    className="bg-gray-100 w-full text-black p-2 rounded-md border border-gray-300 resize-none"
                    rows={2}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Description (Read-only) */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description:</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    disabled
                    className="bg-gray-100 w-full text-black p-2 rounded-md border border-gray-300 resize-none"
                    rows={2}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time:</FormLabel>
                <FormControl>
                  <Input
                    value={field.value ? format(new Date(field.value), "HH:mm dd/MM/yyyy") : "Unknown"}
                    readOnly
                    className="bg-gray-100"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Deadline (Read-only) */}
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline:</FormLabel>
                <FormControl>
                  <Input
                    value={field.value ? format(new Date(field.value), "HH:mm dd/MM/yyyy") : "Unknown"}
                    readOnly
                    className="bg-gray-100"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taskScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Score:</FormLabel>
                <FormControl>
                  <Input
                    value={field.value ? `${field.value} points` : "Unknown point"}
                    readOnly
                    className="bg-gray-100"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Status (Read-only) */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status:</FormLabel>
                <FormControl>
                  <p className="bg-gray-100 w-full text-black p-2 rounded-md border border-gray-300 resize-none">
                    {field.value ? (
                      <span className="text-[#3a8f5e] font-bold">Completed</span>
                    ) : (
                      <span className="text-[#007BFF] font-bold">In progress</span>
                    )}
                  </p>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Student Submissions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.submissionId}>
                <TableCell>{sub.studentName}</TableCell>
                <TableCell>{format(new Date(sub.submittedAt), "HH:mm - dd/MM/yyyy")}</TableCell>
                <TableCell>{sub.grade ? `${sub.grade} point` : "-"}</TableCell>
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

      {/* Dialog chi tiết bài nộp */}
      {selectedSubmission && (
        <SubmissionDetailDialog
          submission={selectedSubmission}
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          onSaveFeedback={handleSaveFeedback}
        />
      )}
    </div>
  );
};

export default TaskDialogClubOwner;
