import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { ScheduleRequest } from "@/api/representative/StudentAPI";

interface CreateClubScheduleDialogProps {
    onClose: () => void;
    onSubmit: (data: ScheduleRequest) => void;
    clubId: string
}

const CreateClubScheduleDialog: React.FC<CreateClubScheduleDialogProps> = ({
    onClose,
    onSubmit,
    clubId
}) => {
    const [scheduleName, setScheduleName] = useState("");
    const [dayOfWeek, setDayOfWeek] = useState("Monday");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");
    const [startDate, setStartDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [endDate, setEndDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const handleSubmit = () => {
        const startTimeValue = parseTime(startTime);
        const endTimeValue = parseTime(endTime);
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Check: End time must be after start time
        if (endTimeValue <= startTimeValue) {
            toast.error("End time must be after start time");
            return;
        }

        // Check: Start date must be >= today
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Clear time
        if (start < today) {
            toast.error("Start date must be today or later");
            return;
        }

        // Check: End date must be >= start date
        if (end < start) {
            toast.error("End date must be after or equal to start date");
            return;
        }

        const data: ScheduleRequest = {
            clubId: clubId,
            scheduleName,
            dayOfWeek,
            startTime,
            endTime,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
        }

        onSubmit(data);
    };

    const parseTime = (timeStr: string) => {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Club Schedule</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Schedule Name</label>
                        <Input
                            value={scheduleName}
                            onChange={(e) => setScheduleName(e.target.value)}
                            placeholder="Enter schedule name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Day of Week</label>
                        <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                    "Sunday",
                                ].map((day) => (
                                    <SelectItem key={day} value={day}>
                                        {day}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Time</label>
                            <Input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Time</label>
                            <Input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date</label>
                            <Input
                                type="date"
                                value={startDate}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Date</label>
                            <Input
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Create Schedule</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateClubScheduleDialog;
