/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Event } from "@/models/Event";
import useAuth from "@/hooks/useAuth";
import { format } from "date-fns";

interface CancelEventDialogProps {
  eventId: string;
  eventData: Event;
  onSuccess?: () => void;
}

export const CancelEventDialog = ({
  eventId,
  eventData,
  onSuccess,
}: CancelEventDialogProps) => {
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const { updateEvent, isUpdating } = useEvents();
  const { user } = useAuth();

  const handleCancelEvent = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    try {
      const formData = new FormData();

      // Thêm các trường cơ bản từ eventData
      formData.append("universityId", user?.userId ?? "");
      formData.append("eventId", eventId);
      formData.append("eventName", eventData.eventName);
      formData.append("description", eventData.description);
      formData.append("startDate", new Date(eventData.startDate).toISOString());
      formData.append("endDate", new Date(eventData.endDate).toISOString());
      formData.append(
        "registeredStartDate",
        new Date(eventData.registeredStartDate).toISOString()
      );
      formData.append(
        "registeredEndDate",
        new Date(eventData.registeredEndDate).toISOString()
      );
      formData.append("price", eventData.price?.toString() || "0");
      formData.append(
        "maxParticipants",
        eventData.maxParticipants?.toString() || "0"
      );
      formData.append(
        "trainingPoint",
        eventData.trainingPoint?.toString() || "0"
      );

      // Thêm các trường liên quan đến hình ảnh và khu vực
      if (eventData.imageUrl) {
        formData.append("ImageUrl", eventData.imageUrl);
      }

      const formattedEventAreas = eventData.eventAreas?.map((area) => ({
        AreaId: area.areaId.toString(),
        Date: format(new Date(area.date), "yyyy-MM-dd"),
        StartTime: area.startTime,
        EndTime: area.endTime,
      }));

      const formattedClubs = eventData.clubs?.map((club) => ({
        ClubId: club.clubId,
        IsHost: club.isHost,
      }));

      formData.append("Clubs", JSON.stringify(formattedClubs));
      formData.append("UniversityId", user?.universityId || "");
      formData.append("EventArea", JSON.stringify(formattedEventAreas));

      if (eventData.eventFields) {
        eventData.eventFields.forEach((field, index) => {
          formData.append(`FieldIds[${index}]`, field.fieldId.toString());
        });
      }

      // Thêm status và cancelReason mới
      formData.append("status", "CANCELED");
      formData.append("cancelReason", cancelReason);

      await updateEvent(formData);
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
      //   toast.error("Failed to cancel event");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Cancel Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this event? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cancelReason">Reason for cancellation</Label>
            <Textarea
              id="cancelReason"
              placeholder="Enter the reason for cancelling this event..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            No, keep event
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancelEvent}
            disabled={isUpdating}
          >
            {isUpdating ? "Cancelling..." : "Yes, cancel event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
