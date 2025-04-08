/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { GetTaskDetailByMember, SendStudentSubmission, TaskDetailForStudent } from "@/api/club-owner/TaskAPI";
import toast from "react-hot-toast";

interface TaskDetailDialogProps {
  initialData: { taskId: string; clubMemberId: string };
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({ initialData, setFlag }) => {
  const [taskDetail, setTaskDetail] = useState<TaskDetailForStudent | null>(null);
  const [editorContent, setEditorContent] = useState("");

  // Lấy chi tiết task từ API dựa trên taskId và clubMemberId
  useEffect(() => {
    async function fetchTask() {
      try {
        const response = await GetTaskDetailByMember(initialData.taskId, initialData.clubMemberId);
        if (response.data) {
          setTaskDetail(response.data);
          // Nếu đã có bài nộp của sinh viên, set vào editorContent
          setEditorContent(response.data.studentSubmission || "");
        }
      } catch (error: any) {
        console.error("Failed to fetch task detail", error);
      }
    }
    fetchTask();
  }, [initialData.taskId, initialData.clubMemberId]);

  // Task được coi là đã nộp nếu submissionStatus là "COMPLETED"
  const isSubmitted = taskDetail?.submissionStatus === "COMPLETED";

  // Xử lý submit: validate editorContent trước khi gọi API
  const handleSubmit = async () => {
    if (editorContent.trim() === "") {
      toast.error("Submission content cannot be empty");
      return;
    }
    console.log("Submitted Content:", editorContent);
    const data = {
      taskId: initialData.taskId,
      clubMemberId: initialData.clubMemberId,
      studentSubmission: editorContent,
    };
    await SendStudentSubmission(data);
    if (setFlag) {
      setFlag(pre => !pre);
    }
    toast.success("Submission sent successfully!");
  };

  return (
    <div className="max-h-[700px] overflow-y-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Task Detail</h2>

      {taskDetail ? (
        <>
          {/* Task Basic Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-bold">Task Name:</p>
              <p>{taskDetail.taskName}</p>
            </div>
            <div>
              <p className="font-bold">Description:</p>
              <p>{taskDetail.description}</p>
            </div>
            <div>
              <p className="font-bold">Start Time:</p>
              <p>
                {taskDetail.startTime
                  ? format(new Date(taskDetail.startTime), "HH:mm dd/MM/yyyy")
                  : "Unknown"}
              </p>
            </div>
            <div>
              <p className="font-bold">Deadline:</p>
              <p>
                {taskDetail.deadline
                  ? format(new Date(taskDetail.deadline), "HH:mm:ss dd/MM/yyyy")
                  : "Unknown"}
              </p>
            </div>
            <div>
              <p className="font-bold">Task Score:</p>
              <p>{taskDetail.taskScore ? `${taskDetail.taskScore} points` : "Unknown"}</p>
            </div>
            <div>
              <p className="font-bold">Submission Status:</p>
              <p>
                <div>
                  {taskDetail.submissionStatus === "COMPLETED" && (
                    <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full text-base font-bold">
                      Completed
                    </span>
                  )}
                  {taskDetail.submissionStatus === "REVIEWING" && (
                    <span className="text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-base font-bold">
                      Reviewing
                    </span>
                  )}
                  {taskDetail.submissionStatus === "OVERDUE" && (
                    <span className="text-red-700 bg-red-100 px-3 py-1 rounded-full text-base font-bold">
                      Overdue
                    </span>
                  )}
                  {taskDetail.submissionStatus === "ON_GOING" && (
                    <span className="text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-base font-bold">
                      On going
                    </span>
                  )}
                </div>
              </p>
            </div>
          </div>

          {/* Submission Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-bold">Submission Score:</p>
              <p>
                {taskDetail.submissionScore
                  ? `${taskDetail.submissionScore} points`
                  : "Not graded"}
              </p>
            </div>
            <div>
              <p className="font-bold">Submission Date:</p>
              <p>
                {taskDetail.submissionDate && taskDetail.submissionDate !== "0001-01-01T00:00:00"
                  ? format(new Date(taskDetail.submissionDate), "HH:mm:ss dd/MM/yyyy")
                  : "Not submitted"}
              </p>
            </div>
          </div>

          {/* Creator & Reviewer Info */}
          <div>
            <div>
              <p className="font-bold">Review By:</p>
              <p>{taskDetail.creator.fullname}</p>
            </div>
            {taskDetail.reviewer && (
              <div>
                <p className="font-bold">Reviewed By:</p>
                <p>
                  {taskDetail.reviewer.fullname} ({taskDetail.reviewer.email})
                </p>
              </div>
            )}
          </div>

          {/* Submission Content */}
          <div className="mt-6">
            {isSubmitted ? (
              <div className="bg-gray-100 p-2 rounded-md border border-gray-300">
                <p className="font-bold">Comment:</p>
                <p className="text-center">{taskDetail.comment || "No comment"}</p>
              </div>
            ) : (
              <ReactQuill
                theme="snow"
                value={editorContent}
                onChange={setEditorContent}
                className="max-h-[400px] overflow-y-auto"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4">
            {isSubmitted ? (
              <DialogClose asChild>
                <Button type="button" className="text-white">
                  Quit
                </Button>
              </DialogClose>
            ) : (
              <Button onClick={handleSubmit}>Submit</Button>
            )}
          </div>
        </>
      ) : (
        <p>Loading task details...</p>
      )}
    </div>
  );
};

export default TaskDetailDialog;
