import { useState } from "react";
import toast from "react-hot-toast";
import { rejectStu } from "@/api/staff/StudentAPI";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DialogLoading from "@/components/ui/dialog-loading";

interface DenyProps {
  userId: string;
  onClose: () => void;
  onSuccess?: () => void;
  dialogAction: string;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
}

export const DenyRequest: React.FC<DenyProps> = ({
  userId,
  onClose,
  onSuccess,
  dialogAction,
  setFlag
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");

  async function handleReject(event: React.FormEvent) {
    event.preventDefault();

    if (!reason.trim()) {
      toast.error("Reason is required.");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Submitting:", { userId, reason });

      if (dialogAction === "reject") {
        await rejectStu(userId, { userId, reason });
        toast.success("Student rejected successfully.");
      } else {
        toast.success("Deactivate University successfully.");
      }

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
                  {dialogAction === "reject" ? "Reject" : "Deactivate"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </>
      )}
    </DialogContent>
  );
};
