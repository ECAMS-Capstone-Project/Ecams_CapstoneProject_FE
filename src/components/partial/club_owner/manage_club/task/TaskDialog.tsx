import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS của React Quill
import { DialogClose } from "@radix-ui/react-dialog";

// Interface Task
interface Task {
  title: string;
  description: string;
  club: string;
  deadline: string;
  status: "In Progress" | "Submitted";
}

interface TaskDetailDialogProps {
  initialData: Task | null;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({ initialData }) => {
  const form = useForm<Task>({
    defaultValues: initialData || {
      title: "",
      description: "",
      club: "",
      deadline: "",
      status: "In Progress",
    },
  });

  const [editorContent, setEditorContent] = useState(""); // State lưu nội dung của ReactQuill

  // Kiểm tra trạng thái Task
  const isSubmitted = initialData?.status === "Submitted";

  // Xử lý submit chỉ gửi `editorContent`
  const onSubmit = () => {
    console.log("Submitted Content:", editorContent);
    alert(`Submitted Content: ${editorContent}`); // Hiển thị nội dung submit
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Task Detail</h2>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Title (Read-only) */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title:</FormLabel>
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
                    rows={2} // Tăng số dòng để hiển thị nhiều hơn
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Club (Read-only) */}
          <FormField
            control={form.control}
            name="club"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Club:</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-gray-100" />
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
                  <Input type="date" {...field} readOnly className="bg-gray-100" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Rich Text Editor (Editable nếu status là "In Progress") */}
          <div className="col-span-2">
            <FormLabel>Task Content:</FormLabel>
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={setEditorContent}
              readOnly={isSubmitted} // Nếu status là Submitted thì không cho chỉnh sửa
              className="bg-white"
            />
          </div>

          {/* Submit hoặc Quit Button */}
          <div className="col-span-2 flex justify-end">
            {isSubmitted ? (
              <DialogClose asChild>
                <Button type="button" className=" text-white">
                  Quit
                </Button>
              </DialogClose>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TaskDetailDialog;
