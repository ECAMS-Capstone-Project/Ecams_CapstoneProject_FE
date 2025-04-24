import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteSubtaskDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function DeleteSubtaskDialog({
  open,
  onClose,
}: DeleteSubtaskDialogProps) {
  //   const { deleteInterTaskDetail } = useInterTask();

  //   const handleDeleteSubtask = async () => {
  //     await deleteInterTaskDetail(subtask.eventTaskDetailId);
  //   };

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
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
