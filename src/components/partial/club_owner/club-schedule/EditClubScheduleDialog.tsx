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

export interface ClubSchedule {
    clubScheduleId: string;
    clubId: string;
    scheduleName: string;
    dayOfWeek: string;
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
    startDate: string; // ISO
    endDate: string;   // ISO
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
    const [scheduleName, setScheduleName] = useState(schedule.scheduleName);
    const [dayOfWeek, setDayOfWeek] = useState(schedule.dayOfWeek);
    const [startTime, setStartTime] = useState(schedule.startTime);
    const [endTime, setEndTime] = useState(schedule.endTime);
    const [startDate, setStartDate] = useState(schedule.startDate.split("T")[0]);
    const [endDate, setEndDate] = useState(schedule.endDate.split("T")[0]);

    const handleSubmit = () => {
        onSubmit({
            ...schedule,
            scheduleName,
            dayOfWeek,
            startTime,
            endTime,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
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
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                    <SelectItem key={day} value={day}>{day}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Time</label>
                            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Time</label>
                            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date</label>
                            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Date</label>
                            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
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
