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
import { ClubCondition } from "@/api/club-owner/ClubByUser";

interface JoinClubDialogProps {
  club: ClubResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export interface ConditionEvidence {
  conditionId: string;
  evidenceFile: File;
}

export const JoinClubDialog: React.FC<JoinClubDialogProps> = ({
  club,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState("");
  const [conditionEvidences, setConditionEvidences] = useState<ConditionEvidence[]>([]);
  const { createClubJoinedRequest, isPending } = useClubs();
  const { user } = useAuth();
  const [allConditions, setAllConditions] = useState<ClubCondition[]>([]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for joining the club!");
      return;
    }
    const missingRequiredConditions = allConditions.filter((condition) =>
      condition.isRequired &&
      !conditionEvidences.find((evi) => evi.conditionId === condition.conditionId)
    );

    if (missingRequiredConditions.length > 0) {
      const missingNames = missingRequiredConditions.map((c) => c.conditionName).join(", ");
      toast.error(`Please upload evidence for required condition(s): ${missingNames}`);
      return;
    }

    try {
      await createClubJoinedRequest({
        ClubId: club.clubId,
        Reason: reason,
        UserId: user?.userId || "",
        ConditionEvidences: conditionEvidences
      });

      onClose();
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to join the club!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[900px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Register to join club {club.clubName}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Please fill in all the required information below
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 px-4">
          <ClubRequirements clubId={club.clubId} conditionEvidences={conditionEvidences} setConditionEvidences={setConditionEvidences} setAllConditions={setAllConditions} />
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why do you want to join our club? <span className="text-red-600">*</span>
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
