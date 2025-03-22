import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Ellipsis } from "lucide-react";
import toast from "react-hot-toast";

interface props {
  isClubOwner: boolean;
}

export function PopoverClub({ isClubOwner }: props) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLeaveClub = () => {
    setOpenLeaveDialog(true)
  };

  const handleChangeClubOwner = () => {
    // Thực hiện xử lý thay đổi chủ câu lạc bộ, ví dụ gọi API
    alert("Change Club Owner clicked!");
  };

  async function handleReject(event: React.FormEvent) {
    event.preventDefault();

    if (!reason.trim()) {
      toast.error("Reason is required.");
      return;
    }

    try {
      setIsLoading(true);
      // await DenyClubAPI(clubId, studentId, { clubId: clubId, userId: studentId, reason });
      toast.success("Rejected successfully.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Ellipsis />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-2">
            {isClubOwner && (
              <>
                <button
                  onClick={() => setOpenEditDialog(true)}
                  className="px-4 py-2 text-left hover:bg-gray-100 rounded-md w-full"
                >
                  Edit Club
                </button>
                <button
                  onClick={handleChangeClubOwner}
                  className="px-4 py-2 text-left hover:bg-gray-100 rounded-md w-full"
                >
                  Request change club owner
                </button>
              </>
            )}
            <button
              onClick={handleLeaveClub}
              className="px-4 py-2 text-left hover:bg-gray-100 rounded-md w-full"
            >
              Leave Club
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Dialog hiển thị khi bấm "Edit Club" */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="max-w-lg">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Edit Club</h3>
            <div className="grid gap-2">
              <Label htmlFor="clubName">Club Name</Label>
              <Input id="clubName" defaultValue="Club Name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clubDescription">Description</Label>
              <Input id="clubDescription" defaultValue="Club Description" />
            </div>
            {/* Bạn có thể thêm các field khác nếu cần */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpenEditDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Thực hiện lưu thông tin chỉnh sửa (có thể gọi API)
                  alert("Club details saved!");
                  setOpenEditDialog(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openLeaveDialog} onOpenChange={setOpenLeaveDialog}>
        <DialogContent className="max-w-lg">
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <h2 className="text-lg font-semibold">Leave Club</h2>
              <DialogDescription>
                Providing a reason for this action.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleReject}>
              <div className="flex flex-col gap-4 mb-4">
                <label className="text-lg font-semibold text-gray-800 mb-2">
                  Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-4 text-gray-700 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your reason why you want to leave this club"
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
        </DialogContent>
      </Dialog>
    </>
  );
}
