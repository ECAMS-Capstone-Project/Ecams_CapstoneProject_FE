import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS của React Quill
import { DialogClose } from "@radix-ui/react-dialog";
import { Task } from "@/models/Task";
import { format } from "date-fns";
import useAuth from "@/hooks/useAuth";

interface TaskDetailDialogProps {
  initialData: Task | null;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({ initialData }) => {
  const form = useForm<Task>({
    defaultValues: initialData || {
      taskName: "",
      description: "",
      deadline: "",
      status: false,
    },
  });
  const { user } = useAuth();
  const [editorContent, setEditorContent] = useState(""); // State lưu nội dung của ReactQuill

  // Kiểm tra trạng thái Task
  const isSubmitted = initialData?.status == true;

  // Xử lý submit chỉ gửi `editorContent`
  const onSubmit = () => {
    console.log("Submitted Content:", editorContent);
    alert(`Submitted Content: ${editorContent}`); // Hiển thị nội dung submit
  };

  return (
    <div className="max-h-[700px] overflow-y-auto p-4">
      <h2 className="text-lg font-semibold">Task Detail</h2>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Task Name */}
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

          {/* Description */}
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

          {/* Deadline */}
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline:</FormLabel>
                <FormControl>
                  <Input
                    value={format(new Date(field.value), "HH:mm:ss dd/MM/yyyy")}
                    readOnly
                    className="bg-gray-100"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status:</FormLabel>
                <FormControl>
                  <p className="bg-gray-100 w-full text-black p-2 rounded-md border border-gray-300">
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

          {/* Rich Text Editor */}
          <div className="col-span-2">
            <FormLabel>Task Content:</FormLabel>
            {isSubmitted ? (
              <div className="bg-gray-100 p-2 rounded-md border border-gray-300">
                <p className="text-center">Task is submitted and cannot be edited</p>
              </div>
            ) : (
              <ReactQuill className="max-h-[400px] overflow-y-auto" theme="snow" value={editorContent} onChange={setEditorContent} />
            )}
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end">
            {isSubmitted ? (
              <DialogClose asChild>
                <Button type="button" className=" text-white">Quit</Button>
              </DialogClose>
            ) : (
              user?.roles.includes("club_owner") ? (
                <DialogClose asChild>
                  <Button type="button" className=" text-white">Quit</Button>
                </DialogClose>
              ) : (
                <Button type="submit">Submit</Button>
              )
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TaskDetailDialog;
