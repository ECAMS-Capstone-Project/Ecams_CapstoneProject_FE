import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface confirmDialog {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSubmit: () => void
}

export default function ConfirmEndEventDialog({ open, setOpen, handleSubmit }: confirmDialog) {
  const handleClose = () => setOpen(false);
  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
          </DialogHeader>
          <div>Do you want to end this event?</div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={handleClose} variant="outline">
              No
            </Button>
            <Button onClick={handleSubmit}>Yes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
