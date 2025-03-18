/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { GetTaskDetailByMember, TaskDetailForStudent } from "@/api/club-owner/TaskAPI";
import { Task } from "@/models/Task";

interface TaskDetailDialogProps {
  initialData: Task;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({ initialData }: TaskDetailDialogProps) => {
  const [taskDetail, setTaskDetail] = useState<TaskDetailForStudent | null>(null);
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    async function fetchTask() {
      try {
        const response = await GetTaskDetailByMember(initialData.taskId, "2");
        if (response.data) {
          setTaskDetail(response.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch task detail", error);
      }
    }
    fetchTask();
  }, [initialData.taskId]);

  // Nếu task đã được nộp (status === true) thì không cho chỉnh sửa nội dung
  const isSubmitted = taskDetail?.submissionStatus == "COMPLETED";

  // Xử lý submit: chỉ gửi nội dung từ ReactQuill (bạn có thể tích hợp API submit vào đây)
  const handleSubmit = () => {
    console.log("Submitted Content:", editorContent);
    alert(`Submitted Content: ${editorContent}`);
    // Gọi API submit ở đây nếu cần
  };
  console.log(taskDetail);

  return (
    <div className="max-h-[700px] overflow-y-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Task Detail</h2>

      {taskDetail ? (
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
            <p className="font-bold">Status:</p>
            <p>
              {taskDetail.submissionStatus == "COMPLETED" ? (
                <span className="text-[#3a8f5e] font-bold">Submitted</span>
              ) : (
                <span className="text-[#007BFF] font-bold">Not submitted</span>
              )}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading task details...</p>
      )}

      <div className="mt-6">
        {isSubmitted ? (
          <div className="bg-gray-100 p-2 rounded-md border border-gray-300">
            <p className="text-center">Task is submitted and cannot be edited</p>
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
    </div>
  );
};

export default TaskDetailDialog;
