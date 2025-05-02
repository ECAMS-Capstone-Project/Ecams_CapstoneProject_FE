/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface RoleDropdownCellProps {
  role: string;
  row: any; // Có thể thay đổi kiểu dữ liệu cho phù hợp, ví dụ: ClubMemberDTO
  isClubOwner: boolean
}

const RoleDropdownCell: React.FC<RoleDropdownCellProps> = ({ role, row, isClubOwner }) => {
  const isCurrentUserClubOwner = isClubOwner;

  // Nếu user hiện tại là club owner và role của hàng không phải là CLUB_OWNER,
  // cho phép thay đổi role.
  const [selectedRole, setSelectedRole] = useState(role);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Nếu user hiện tại không phải club owner hoặc hàng có role là CLUB_OWNER,
  // thì chỉ hiển thị text, không cho chỉnh sửa.
  if (!isCurrentUserClubOwner || role === "CLUB_OWNER") {
    const styleClass =
      role === "CLUB_OWNER"
        ? "w-[180px] p-2 rounded-md text-center bg-slate-700 text-white"
        : "w-[180px] p-2 rounded-md text-center bg-[#88f0b0] text-[#2F4F4F]";
    return <div className={styleClass}>{role}</div>;
  }

  // Danh sách role thay thế (không bao gồm "CLUB_OWNER")
  const availableRoles = ["CLUB_MEMBER"];

  const handleValueChange = (value: string) => {
    setSelectedRole(value);
    setConfirmOpen(true);
  };

  const confirmChange = async () => {
    setLoading(true);
    try {
      // Gọi API cập nhật role tại đây (thay endpoint và logic xử lý phù hợp)
      console.log("Role updated successfully:", selectedRole, row);
      setConfirmOpen(false);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Có lỗi xảy ra khi cập nhật vai trò");
      setSelectedRole(role);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý đóng dialog, nếu đóng mà không bấm nút nào thì coi như "Cancel"
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Nếu dialog bị đóng (click outside, nhấn ESC,...)
      setSelectedRole(role);
    }
    setConfirmOpen(open);
  };

  const selectTriggerClass = `w-[180px] p-2 rounded-md text-center bg-[#88f0b0] text-[#2F4F4F]`;

  return (
    <div className="flex flex-col items-center justify-center">
      <Select value={selectedRole} onValueChange={handleValueChange}>
        <SelectTrigger className={selectTriggerClass}>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Dialog xác nhận thay đổi role */}
      <Dialog open={confirmOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-screen-md">
          <p className="mb-4">Do you want to change this member role?</p>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 border rounded-md"
              onClick={() => {
                setSelectedRole(role);
                setConfirmOpen(false);
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={confirmChange}
              disabled={loading}
            >
              {loading ? "Updating..." : "Confirm"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleDropdownCell;
