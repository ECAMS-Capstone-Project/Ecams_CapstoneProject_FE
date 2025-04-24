import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInterTask } from "@/hooks/club/useInterTask";
import { InterTask } from "@/models/InterTask";

interface DeleteSubtaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: InterTask;
  eventId: string;
}

export default function DeleteSubtaskDialog({
  open,
  onClose,
  task,
  eventId,
}: DeleteSubtaskDialogProps) {
  const { updateInterEventTask } = useInterTask();

  const handleCompleteTask = async () => {
    await updateInterEventTask({
      ...task,
      status: "COMPLETED",
      eventTaskId: task.eventTaskId,
      clubId: task.clubId,
      eventId: eventId,
      taskName: task.taskName,
      description: task.description,
      startTime: task.startTime,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-5 border-none">
        <DialogHeader>
          <DialogTitle className=" font-bold text-xl">
            Complete Task
          </DialogTitle>
          <DialogDescription className="text-md">
            Are you sure you want to complete this task?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-5">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="custom" onClick={handleCompleteTask}>
            Complete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
