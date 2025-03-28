import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface CreateClubScheduleDialogProps {
    onClose: () => void;
    onSubmit: (data: {
        scheduleName: string;
        dayOfWeek: string;
        startTime: string;
        endTime: string;
        status: boolean;
    }) => void;
}

const CreateClubScheduleDialog: React.FC<CreateClubScheduleDialogProps> = ({ onClose, onSubmit }) => {
    const [scheduleName, setScheduleName] = useState<string>("");
    const [dayOfWeek, setDayOfWeek] = useState<string>("Monday");
    const [startTime, setStartTime] = useState<string>("09:00");
    const [endTime, setEndTime] = useState<string>("10:00");
    const [status, setStatus] = useState<boolean>(true);

    const handleSubmit = () => {
        onSubmit({ scheduleName, dayOfWeek, startTime, endTime, status });
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
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
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
                        <Checkbox
                            checked={status}
                            onCheckedChange={(val) => setStatus(val as boolean)}
                        />
                        <span className="text-sm">Active</span>
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
