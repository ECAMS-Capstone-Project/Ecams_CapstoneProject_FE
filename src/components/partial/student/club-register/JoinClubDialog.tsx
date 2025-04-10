/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClubResponse } from "@/models/Club";
import toast from "react-hot-toast";
import ClubRequirements from "./ClubCondition";
import { XCircleIcon } from "lucide-react";
import { useClubs } from "@/hooks/student/useClub";
import useAuth from "@/hooks/useAuth";

interface JoinClubDialogProps {
  club: ClubResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const JoinClubDialog: React.FC<JoinClubDialogProps> = ({
  club,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState("");
  const { createClubJoinedRequest, isPending } = useClubs();
  const { user } = useAuth();
  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for joining the club!");
      return;
    }

    try {
      // TODO: Call API to register for club here
      await createClubJoinedRequest({
        clubId: club.clubId,
        reason: reason,
        userId: user?.userId || "",
      });

      onClose();
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to join the club!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Register to join {club.clubName}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Please fill in all the required information below
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 px-4">
          <ClubRequirements clubId={club.clubId} />
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why do you want to join our club?
              </label>
              <textarea
                placeholder="Share why you want to join this club..."
                className="min-h-[120px] w-full border border-gray-300 rounded-md p-2"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-4 text-red-800"
                disabled={isPending}
              >
                <XCircleIcon size={14} /> Cancel
              </Button>
              <Button
                variant="custom"
                className="px-6"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? "Processing..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
