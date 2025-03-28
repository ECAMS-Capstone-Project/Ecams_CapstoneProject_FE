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

// Interface theo schema của ClubSchedule
export interface ClubSchedule {
    ClubScheduleId: string;
    ClubId: string;
    ScheduleName: string;
    DayOfWeek: string;
    StartTime: string; // "HH:MM" format
    EndTime: string;   // "HH:MM" format
    Status: boolean;
}

interface EditClubScheduleDialogProps {
    schedule: ClubSchedule;
    onClose: () => void;
    onSubmit: (updated: ClubSchedule) => void;
}

const EditClubScheduleDialog: React.FC<EditClubScheduleDialogProps> = ({
    schedule,
    onClose,
    onSubmit,
}) => {
    // Khởi tạo state từ dữ liệu schedule hiện có.
    const [scheduleName, setScheduleName] = useState(schedule.ScheduleName);
    const [dayOfWeek, setDayOfWeek] = useState(schedule.DayOfWeek);
    const [startTime, setStartTime] = useState(schedule.StartTime);
    const [endTime, setEndTime] = useState(schedule.EndTime);
    const [status, setStatus] = useState(schedule.Status);

    const handleSubmit = () => {
        onSubmit({
            ...schedule,
            ScheduleName: scheduleName,
            DayOfWeek: dayOfWeek,
            StartTime: startTime,
            EndTime: endTime,
            Status: status,
        });
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Club Schedule</DialogTitle>
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
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Start Time</label>
                            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">End Time</label>
                            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={status}
                            onChange={(e) => setStatus(e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="text-sm">Active</span>
                    </div>
                </div>
                <DialogFooter className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditClubScheduleDialog;
