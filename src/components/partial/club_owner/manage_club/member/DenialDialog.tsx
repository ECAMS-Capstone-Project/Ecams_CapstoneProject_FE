import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import DialogLoading from "@/components/ui/dialog-loading";
import useAuth from "@/hooks/useAuth";
import { ApproveOrDenyRequestJoinClub } from "@/api/club-owner/ClubByUser";

interface DenyProps {
  clubId: string
  memberId: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
}

export const DenyMemberJoinClub: React.FC<DenyProps> = ({
  clubId,
  memberId,
  onClose,
  onSuccess,
  open,
  setFlag
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");
  const { user } = useAuth();
  async function handleReject(event: React.FormEvent) {
    event.preventDefault();

    if (!reason.trim()) {
      toast.error("Reason is required.");
      return;
    }
    if (!user) return;
    try {
      setIsLoading(true);
      await ApproveOrDenyRequestJoinClub(clubId, memberId, { clubMemberId: memberId, reason: reason, acceptedBy: user?.userId, isAccepted: false });
      toast.success("Rejected successfully.");
      onClose();
      if (onSuccess) onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      if (setFlag) {
        setFlag(pre => !pre)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg min-h-[200px] sm:min-h-[300px] h-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full w-full">
            <DialogLoading />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Give your reason</DialogTitle>
              <DialogDescription>
                Providing a reason for this action.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 p-4">
              <form onSubmit={handleReject}>
                <div className="flex flex-col gap-4 mb-4">
                  <label className="text-lg font-semibold text-gray-800 mb-2">
                    Reason
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-4 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your reason for rejection"
                    rows={4}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading} color="primary">
                    Reject
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
