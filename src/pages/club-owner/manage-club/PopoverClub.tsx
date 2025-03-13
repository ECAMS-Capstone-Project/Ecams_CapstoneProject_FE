import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Ellipsis } from "lucide-react";

export function PopoverClub() {
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleLeaveClub = () => {
    // Thực hiện xử lý rời câu lạc bộ, ví dụ gọi API
    alert("Leave Club clicked!");
  };

  const handleChangeClubOwner = () => {
    // Thực hiện xử lý thay đổi chủ câu lạc bộ, ví dụ gọi API
    alert("Change Club Owner clicked!");
  };

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
            <button
              onClick={() => setOpenEditDialog(true)}
              className="px-4 py-2 text-left hover:bg-gray-100 rounded-md w-full"
            >
              Edit Club
            </button>
            <button
              onClick={handleLeaveClub}
              className="px-4 py-2 text-left hover:bg-gray-100 rounded-md w-full"
            >
              Leave Club
            </button>
            <button
              onClick={handleChangeClubOwner}
              className="px-4 py-2 text-left hover:bg-gray-100 rounded-md w-full"
            >
              Change Club Owner
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
    </>
  );
}
