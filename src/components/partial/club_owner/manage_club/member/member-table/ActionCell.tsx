/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableRowActiveActions } from "./row-actions-active";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KickMemberAPI } from "@/api/club-owner/ClubByUser";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export const ActionCell = ({
  row,
  setFlag,
}: {
  row: any;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isKickDialogOpen, setIsKickDialogOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleKick = async () => {
    const clubMemberId = row.original.clubMemberId as string;
    if (reason == undefined || reason == "") {
      toast.error("Reason is required");
      return;
    }
    try {
      setIsLoading(true);
      await KickMemberAPI(clubMemberId, {
        clubMemberId: clubMemberId,
        reason: reason,
      });
      toast.success("Kick member successfully");
      setFlag?.((prev) => !prev);
      setIsKickDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded-md transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            View Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsKickDialogOpen(true)}
            className="text-red-600"
          >
            Kick
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DataTableRowActiveActions row={row} setFlag={setFlag} />
        </DialogContent>
      </Dialog>

      <Dialog open={isKickDialogOpen} onOpenChange={setIsKickDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Kick Member Alert</h2>
            <p>Are you sure you want to kick this member?</p>
            <div className="flex flex-col gap-4 mb-4">
              <label className="text-lg font-semibold text-gray-800 mb-2">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-4 text-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your reason why you want to kick this member"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsKickDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={reason == "" || isLoading}
                onClick={handleKick}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kicking...
                  </>
                ) : (
                  "Kick"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
