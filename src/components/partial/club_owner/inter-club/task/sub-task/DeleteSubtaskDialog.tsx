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
import { EventTaskDetail } from "@/models/InterTask";

interface DeleteSubtaskDialogProps {
  open: boolean;
  onClose: () => void;
  subtask: EventTaskDetail | null;
}

export default function DeleteSubtaskDialog({
  open,
  onClose,
  subtask,
}: DeleteSubtaskDialogProps) {
  const { deleteSubtask } = useInterTask();

  const handleDeleteSubtask = async () => {
    await deleteSubtask({
      eventTaskDetailId: subtask ? subtask.eventTaskDetailId : "",
      eventTaskId: subtask ? subtask.eventTaskId : "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-5 border-none">
        <DialogHeader>
          <DialogTitle className=" font-bold text-xl">
            Delete Subtask
          </DialogTitle>
          <DialogDescription className="text-md">
            Are you sure you want to delete this subtask?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-5">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteSubtask}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
