import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DialogLoading from "@/components/ui/dialog-loading";
import { InterClubEventDTO } from "@/models/Event";
import { EventClubDTO } from "@/api/representative/EventAgent";

interface EndEventDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  event: InterClubEventDTO;
  isEnding: boolean;
  currentClub: EventClubDTO;
}

export const EndEventDialog: React.FC<EndEventDialogProps> = ({
  open,
  onClose,
  onConfirm,
  event,
  isEnding,
  currentClub,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };
  // Kiểm tra xem club host đã bấm kết thúc sự kiện chưa
  const isHostEventEnded =
    event.clubs.find((club) => club.isHost)?.isEnd === true;
  const isHost = event.clubs.find(
    (club) => club.clubId === currentClub.clubId
  )?.isHost; // Kiểm tra xem đây có phải là club host không

  console.log(isHostEventEnded);
  console.log(isHost);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        {isLoading ? (
          <div className="flex justify-center items-center h-full w-full">
            <DialogLoading />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm End Event</DialogTitle>
              <DialogDescription>
                {isHost || isHostEventEnded
                  ? `Are you sure you want to end the event ${event.eventName}? This action cannot be undone.`
                  : "You are not able to end the event now, you need to wait until the host ends the event."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                {isEnding ? "Cancelling..." : "Cancel"}
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={isEnding || (!isHost && !isHostEventEnded)} // Disable nút "Confirm" cho các club không phải host nếu host chưa bấm "End Event"
              >
                {isEnding ? "Ending..." : "Confirm"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
