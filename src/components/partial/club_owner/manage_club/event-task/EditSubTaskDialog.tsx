/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  EventTaskDetail,
  InterTask,
  UpdateSubtaskRequest,
} from "@/models/InterTask";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LoadingAnimation from "@/components/ui/loading";
import { fixTime } from "@/lib/utils";
interface EditSubTaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: EventTaskDetail | null;
  onSubmit: (updatedTask: UpdateSubtaskRequest) => void;
  bigTask: InterTask;
  isUpdating: boolean;
  initialSelectedTasks?: EventTaskDetail[];
}

type FormState = {
  name: string;
  desc: string;
  priority: string;
  status: string;
  startDate: Date | undefined;
  startTime: string;
  deadlineDate: Date | undefined;
  deadlineTime: string;
  isDependencyExtended: boolean;
  taskDependencyIds: string[];
  assignedMemberIds: string[];
};

type ErrorState = Partial<Record<keyof FormState, string>>;

export default function EditSubTaskDialog2({
  open,
  onClose,
  task,
  onSubmit,
  bigTask,
  isUpdating,
}: EditSubTaskDialogProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    desc: "",
    priority: "LOW",
    status: "NOT_STARTED",
    startDate: undefined,
    startTime: "00:00",
    deadlineDate: undefined,
    deadlineTime: "00:00",
    isDependencyExtended: false,
    taskDependencyIds: [],
    assignedMemberIds: [],
  });
  const [showDependencyCheckbox, setShowDependencyCheckbox] = useState(false);
  const [originalTimes, setOriginalTimes] = useState({
    startDate: undefined as Date | undefined,
    startTime: "",
    deadlineDate: undefined as Date | undefined,
    deadlineTime: "",
  });

  const [errors, setErrors] = useState<ErrorState>({});

  useEffect(() => {
    if (task) {
      const start = new Date(task.startTime);
      const deadline = new Date(task.deadline);

      setForm({
        name: task.detailName,
        desc: task.description || "",
        priority: task.priority,
        status: task.status,
        startDate: new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate()
        ),
        startTime: format(start, "HH:mm"),
        deadlineDate: new Date(
          deadline.getFullYear(),
          deadline.getMonth(),
          deadline.getDate()
        ),
        deadlineTime: format(deadline, "HH:mm"),
        isDependencyExtended: false,
        taskDependencyIds:
          task?.taskDependencies?.map(
            (dependency) => dependency.eventTaskDetailId
          ) || [],
        assignedMemberIds:
          task?.memberEventTasks?.map((member) => member.clubMemberId) || [],
      });

      setOriginalTimes({
        startDate: new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate()
        ),
        startTime: format(start, "HH:mm"),
        deadlineDate: new Date(
          deadline.getFullYear(),
          deadline.getMonth(),
          deadline.getDate()
        ),
        deadlineTime: format(deadline, "HH:mm"),
      });

      setErrors({});
    }
  }, [task]);

  useEffect(() => {
    const hasTimeChanged =
      form.startDate?.getTime() !== originalTimes.startDate?.getTime() ||
      form.startTime !== originalTimes.startTime ||
      form.deadlineDate?.getTime() !== originalTimes.deadlineDate?.getTime() ||
      form.deadlineTime !== originalTimes.deadlineTime;

    setShowDependencyCheckbox(hasTimeChanged);
  }, [
    form.startDate,
    form.startTime,
    form.deadlineDate,
    form.deadlineTime,
    originalTimes,
  ]);

  const validate = () => {
    const newErrors: ErrorState = {};

    if (!form.name.trim()) newErrors.name = "Task name is required.";
    if (!form.startDate) newErrors.startDate = "Start date is required.";
    if (!form.deadlineDate)
      newErrors.deadlineDate = "Deadline date is required.";

    if (form.startDate) {
      const [startH, startM] = form.startTime.split(":").map(Number);
      const start = new Date(form.startDate);
      start.setHours(startH, startM, 0, 0);

      const taskStartDate = new Date(bigTask?.startTime);

      if (start < taskStartDate) {
        newErrors.startDate = "Start time must be later than task start time.";
      }
    }

    if (form.startDate && form.deadlineDate) {
      const taskEndDate = new Date(bigTask?.deadline);
      const [startH, startM] = form.startTime.split(":").map(Number);
      const [endH, endM] = form.deadlineTime.split(":").map(Number);
      const start = new Date(form.startDate);
      start.setHours(startH, startM, 0, 0);
      const end = new Date(form.deadlineDate);
      end.setHours(endH, endM, 0, 0);

      if (start >= end) {
        newErrors.deadlineDate = "Deadline must be after start time.";
      }
      if (end > taskEndDate) {
        newErrors.deadlineDate = "Deadline must be sooner than task end time.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !task || !form.startDate || !form.deadlineDate) return;

    const isoFormattedStart = format(
      new Date(`${format(form.startDate, "yyyy-MM-dd")}T${form.startTime}`),
      "yyyy-MM-dd'T'HH:mm"
    );
    const isoFormattedDeadline = format(
      new Date(
        `${format(form.deadlineDate, "yyyy-MM-dd")}T${form.deadlineTime}`
      ),
      "yyyy-MM-dd'T'HH:mm"
    );

    const updatedTask: UpdateSubtaskRequest = {
      eventTaskDetailId: task.eventTaskDetailId,
      eventTaskId: task.eventTaskId,
      detailName: form.name,
      description: form.desc,
      priority: form.priority,
      status: form.status,
      startTime: fixTime(isoFormattedStart).toISOString(),
      deadline: fixTime(isoFormattedDeadline).toISOString(),
      isDependencyExtended: form.isDependencyExtended,
      taskDependencyIds: form.taskDependencyIds,
      assignedMemberIds: form.assignedMemberIds,
    };

    await onSubmit(updatedTask);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>Edit Sub Task</DialogTitle>
        <DialogDescription>
          Edit the subtask details and save to update the task.
        </DialogDescription>
        <div className="space-y-4 ">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Task Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(val) => setForm({ ...form, priority: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <div className="space-y-1">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    {form.startDate
                      ? format(form.startDate, "dd/MM/yyyy")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={form.startDate}
                    onSelect={(date) => setForm({ ...form, startDate: date })}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label>Time</Label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    {form.deadlineDate
                      ? format(form.deadlineDate, "dd/MM/yyyy")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={form.deadlineDate}
                    onSelect={(date) =>
                      setForm({ ...form, deadlineDate: date })
                    }
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label>Time</Label>
              <Input
                type="time"
                value={form.deadlineTime}
                onChange={(e) =>
                  setForm({ ...form, deadlineTime: e.target.value })
                }
              />
              {errors.deadlineDate && (
                <p className="text-red-500 text-sm">{errors.deadlineDate}</p>
              )}
            </div>
          </div>
          {showDependencyCheckbox && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDependencyExtended"
                checked={form.isDependencyExtended}
                onChange={(e) =>
                  setForm({ ...form, isDependencyExtended: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isDependencyExtended"
                className="text-base font-semibold text-[#3ca1a2]"
              >
                Extend the dates of the task dependencies of this subtask.
              </label>
            </div>
          )}

          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(val) => setForm({ ...form, status: val })}
                disabled={task?.status === "COMPLETED"}
              >
                <SelectTrigger
                  className={cn(
                    "font-bold border",
                    form.status === "NOT_STARTED" &&
                    "bg-gray-100 text-gray-700",
                    form.status === "ON_GOING" && "bg-blue-100 text-blue-800",
                    form.status === "COMPLETED" &&
                    "bg-green-200 text-green-800",
                    form.status === "REVIEWING" &&
                    "bg-yellow-100 text-yellow-800",
                    form.status === "OVERDUE" && "bg-red-100 text-red-800",
                    task?.status === "COMPLETED" && "cursor-not-allowed"
                  )}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                  <SelectItem value="ON_GOING">On Going</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REVIEWING">Reviewing</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isUpdating ? <LoadingAnimation /> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
