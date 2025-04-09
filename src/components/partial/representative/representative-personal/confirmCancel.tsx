/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { Contract } from "@/models/Contract";
import { CancelContractRepresentative } from "@/api/representative/ContractAPI";
import { useState } from "react";
import toast from "react-hot-toast";

interface ConfirmDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  contract: Contract | null;
}

export default function ConfirmCancelDialog({
  open,
  setOpen,
  contract,
}: ConfirmDialogProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (!isLoading) {
      setOpen(false);
    }
  };

  async function handleReject(event: React.FormEvent) {
    event.preventDefault();
    if (!reason.trim()) {
      toast.error("Reason is required.");
      return;
    }
    if (!contract || !user) return;
    try {
      setIsLoading(true);
      await CancelContractRepresentative(
        contract.contractId,
        user.userId,
        reason,
        user.universityId || ""
      );
      toast.success("Cancel contract successfully.");
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to cancel the package?
          </DialogTitle>
        </DialogHeader>

        {/* Nội dung */}
        <div className="grid gap-4 p-4">
          <form onSubmit={handleReject}>
            <div className="flex flex-col gap-4 mb-4">
              <label className="text-lg font-semibold text-gray-800 mb-2">
                Give your reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-4 text-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your reason for cancel the package"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                disabled={isLoading}
              >
                No
              </Button>
              <Button type="submit" color="primary" disabled={isLoading}>
                Yes
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
