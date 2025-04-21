import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventTaskDetail } from "@/models/InterTask";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EditSubTaskDialogProps {
    open: boolean;
    onClose: () => void;
    task: EventTaskDetail | null;
    onSubmit: (updatedTask: EventTaskDetail) => void;
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
};

type ErrorState = Partial<Record<keyof FormState, string>>;

export default function EditSubTaskDialog({
    open,
    onClose,
    task,
    onSubmit,
}: EditSubTaskDialogProps) {
    const [form, setForm] = useState<FormState>({
        name: "",
        desc: "",
        priority: "LOW",
        status: "ON_GOING",
        startDate: undefined,
        startTime: "00:00",
        deadlineDate: undefined,
        deadlineTime: "00:00",
    });

    const [errors, setErrors] = useState<ErrorState>({});

    useEffect(() => {
        if (task && !open) {
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
                startTime: format(start, "HH:MM"),
                deadlineDate: new Date(
                    deadline.getFullYear(),
                    deadline.getMonth(),
                    deadline.getDate()
                ),
                deadlineTime: format(deadline, "HH:MM"),
            });
            setErrors({});
        }
    }, [task, open]);


    const validate = () => {
        const newErrors: ErrorState = {};
        const now = new Date();

        if (!form.name.trim()) newErrors.name = "Task name is required.";
        if (!form.startDate) newErrors.startDate = "Start date is required.";
        if (!form.deadlineDate) newErrors.deadlineDate = "Deadline date is required.";

        if (form.startDate) {
            const [startH, startM] = form.startTime.split(":").map(Number);
            const start = new Date(form.startDate);
            start.setHours(startH, startM, 0, 0);

            const today = new Date(now);
            today.setHours(0, 0, 0, 0);

            if (start < now && form.startDate.toDateString() === now.toDateString()) {
                newErrors.startDate = "Start time must be later than current time.";
            } else if (form.startDate < today) {
                newErrors.startDate = "Start date must be today or later.";
            }
        }

        if (form.startDate && form.deadlineDate) {
            const [startH, startM] = form.startTime.split(":").map(Number);
            const [endH, endM] = form.deadlineTime.split(":").map(Number);
            const start = new Date(form.startDate);
            start.setHours(startH, startM, 0, 0);
            const end = new Date(form.deadlineDate);
            end.setHours(endH, endM, 0, 0);

            if (start >= end) {
                newErrors.deadlineDate = "Deadline must be after start time.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSave = () => {
        if (!validate() || !task) return;

        const isoFormattedStart = format(new Date(`${format(form.startDate!, "yyyy-MM-dd")}T${form.startTime}`), "yyyy-MM-dd'T'HH:mm");
        const isoFormattedDeadline = format(new Date(`${format(form.deadlineDate!, "yyyy-MM-dd")}T${form.deadlineTime}`), "yyyy-MM-dd'T'HH:mm");


        const updatedTask: EventTaskDetail = {
            ...task,
            detailName: form.name,
            description: form.desc,
            priority: form.priority,
            status: form.status,
            startTime: new Date(isoFormattedStart),
            deadline: new Date(isoFormattedDeadline),
        };

        onSubmit(updatedTask);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="space-y-4 max-w-xl">
                <DialogTitle>Edit Sub Task</DialogTitle>

                <div className="space-y-1">
                    <Label>Task Name</Label>
                    <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                    <Label>Description</Label>
                    <Textarea
                        value={form.desc}
                        onChange={(e) => setForm({ ...form, desc: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                    <div className="space-y-1">
                        <Label>Status</Label>
                        <Select
                            value={form.status}
                            onValueChange={(val) => setForm({ ...form, status: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ON_GOING">On Going</SelectItem>
                                <SelectItem value="COMPLETE">Completed</SelectItem>
                                <SelectItem value="REVIEWING">Reviewing</SelectItem>
                                <SelectItem value="OVERDUE">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
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
                        <Input
                            type="time"
                            value={form.startTime}
                            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                        />
                        {errors.startDate && (
                            <p className="text-red-500 text-sm">{errors.startDate}</p>
                        )}
                    </div>

                    <div className="space-y-1">
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

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
