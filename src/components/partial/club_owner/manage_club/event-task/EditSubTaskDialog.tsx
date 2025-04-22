import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventTaskDetail, EventTaskDetail2, InterTask } from "@/models/InterTask";
import { Suspense, useEffect, useState } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import LoadingAnimation from "@/components/ui/loading";
import { fixTime } from "@/lib/utils";
import SpecificTaskList from "@/components/partial/representative/representative-task/SpecificTasktList";

interface EditSubTaskDialogProps {
    open: boolean;
    onClose: () => void;
    task: EventTaskDetail | null;
    onSubmit: (updatedTask: EventTaskDetail2) => void;
    bigTask: InterTask;
    isUpdating: boolean;
    initialSelectedTasks?: EventTaskDetail[];
}

type FormState = {
    name: string;
    desc: string;
    priority: string;
    startDate: Date | undefined;
    startTime: string;
    deadlineDate: Date | undefined;
    deadlineTime: string;
};

type ErrorState = Partial<Record<keyof FormState, string>>;

const fakeTasks = [
    {
        eventTaskDetailId: "etd001",
        eventTaskId: "et001",
        detailName: "Design Landing Page",
        description: "Create a responsive landing page for the campaign.",
        startTime: "2025-04-01T09:00:00",
        deadline: "2025-04-15T17:00:00",
        status: "In Progress",
        priority: "High",
    },
    {
        eventTaskDetailId: "etd002",
        eventTaskId: "et002",
        detailName: "Write Content",
        description: "Write high-conversion copy for the homepage.",
        startTime: "2025-04-02T10:00:00",
        deadline: "2025-04-12T18:00:00",
        status: "Pending",
        priority: "Medium",
    },
    {
        eventTaskDetailId: "etd003",
        eventTaskId: "et003",
        detailName: "Set Up Database",
        description: "Initialize the PostgreSQL database and design schema.",
        startTime: "2025-04-03T08:30:00",
        deadline: "2025-04-20T16:00:00",
        status: "Completed",
        priority: "Low",
    },
    {
        eventTaskDetailId: "etd004",
        eventTaskId: "et003",
        detailName: "Create ER Diagram",
        description: "Draw entity-relationship diagram for core modules.",
        startTime: "2025-04-04T11:00:00",
        deadline: "2025-04-18T14:00:00",
        status: "In Progress",
        priority: "Medium",
    },
    {
        eventTaskDetailId: "etd005",
        eventTaskId: "et004",
        detailName: "Client Review Meeting",
        description: "Prepare slides and conduct a client meeting.",
        startTime: "2025-04-06T13:00:00",
        deadline: "2025-04-07T15:00:00",
        status: "Pending",
        priority: "High",
    },
];

export default function EditSubTaskDialog({
    open,
    onClose,
    task,
    onSubmit,
    bigTask,
    isUpdating
}: EditSubTaskDialogProps) {
    const [form, setForm] = useState<FormState>({
        name: "",
        desc: "",
        priority: "LOW",
        startDate: undefined,
        startTime: "00:00",
        deadlineDate: undefined,
        deadlineTime: "00:00",
    });
    const [searchTerm2, setSearchTerm2] = useState("");
    const [debouncedSearch2, setDebouncedSearch2] = useState(searchTerm2);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch2(searchTerm2), 500);
        return () => clearTimeout(timer);
    }, [searchTerm2]);

    const filteredTasks = fakeTasks.filter((st) =>
        st.detailName.toLowerCase().includes(debouncedSearch2.toLowerCase())
    );

    const [errors, setErrors] = useState<ErrorState>({});

    useEffect(() => {
        if (task) {
            const start = new Date(task.startTime);
            const deadline = new Date(task.deadline);

            setForm({
                name: task.detailName,
                desc: task.description || "",
                priority: task.priority,
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
            // if (initialSelectedTasks && initialSelectedTasks.length > 0) {
            //     setSelectedTasks(initialSelectedTasks.map(t => t.eventTaskDetailId));
            // }
            setErrors({});
        }
    }, [task]);


    const handleToggleTask = (taskId: string, checked: boolean) => {
        setSelectedTasks((prev) => {
            if (checked) {
                return [...prev, taskId];
            } else {
                return prev.filter((id) => id !== taskId);
            }
        });
    };

    const validate = () => {
        const newErrors: ErrorState = {};

        if (!form.name.trim()) newErrors.name = "Task name is required.";
        if (!form.startDate) newErrors.startDate = "Start date is required.";
        if (!form.deadlineDate) newErrors.deadlineDate = "Deadline date is required.";

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
        if (!validate() || !task) return;

        const isoFormattedStart = format(new Date(`${format(form.startDate!, "yyyy-MM-dd")}T${form.startTime}`), "yyyy-MM-dd'T'HH:mm");
        const isoFormattedDeadline = format(new Date(`${format(form.deadlineDate!, "yyyy-MM-dd")}T${form.deadlineTime}`), "yyyy-MM-dd'T'HH:mm");


        const updatedTask: EventTaskDetail2 = {
            ...task,
            detailName: form.name,
            description: form.desc,
            priority: form.priority,
            status: task.status,
            startTime: fixTime(isoFormattedStart).toISOString(),
            deadline: fixTime(isoFormattedDeadline).toISOString(),
        };

        await onSubmit(updatedTask);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="space-y-4 max-w-3xl max-h-[900px] overflow-y-auto">
                <DialogTitle>Edit Sub Task</DialogTitle>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Task Name</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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

                <div className="grid grid-cols-2 gap-2">
                    <div className="flex gap-4">
                        <div>
                            <Label>Start Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left">
                                        {form.startDate ? format(form.startDate, "dd/MM/yyyy") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        mode="single"
                                        selected={form.startDate}
                                        onSelect={(date) => setForm({ ...form, startDate: date })}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <Label>Time</Label>
                            <Input
                                type="time"
                                value={form.startTime}
                                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                            />
                            {errors.startDate && (
                                <p className="text-red-500 text-sm">{errors.startDate}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div>
                            <Label>Deadline</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left">
                                        {form.deadlineDate ? format(form.deadlineDate, "dd/MM/yyyy") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        mode="single"
                                        selected={form.deadlineDate}
                                        onSelect={(date) => setForm({ ...form, deadlineDate: date })}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <Label>Time</Label>
                            <Input
                                type="time"
                                value={form.deadlineTime}
                                onChange={(e) => setForm({ ...form, deadlineTime: e.target.value })}
                            />
                            {errors.deadlineDate && (
                                <p className="text-red-500 text-sm">{errors.deadlineDate}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pl-1">
                    <label className="block text-sm font-medium mb-2">Choose task</label>
                    <div className="flex gap-3">
                        {/* Search bar */}
                        <div className="mb-2 w-1/4">
                            <Input
                                placeholder="Search task"
                                value={searchTerm2}
                                onChange={(e) => setSearchTerm2(e.target.value)}
                            />
                        </div>
                    </div>
                    <Suspense fallback={<div>Loading task...</div>}>
                        <SpecificTaskList
                            handleToggleTask={handleToggleTask}
                            tasks={filteredTasks}
                            selected={selectedTasks}
                        />
                    </Suspense>
                    {/* {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>} */}
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
