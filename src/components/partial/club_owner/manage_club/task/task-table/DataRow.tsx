/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditTaskDialog from "../TaskEditDialog";
import TaskDialogClubOwner from "../TaskDialogClubOwner";
import { useParams } from "react-router-dom";

interface DataTableRowActionsProps {
  row: any; // Thay 'any' bằng kiểu TaskDetailDTO nếu có
  setFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataRow: React.FC<DataTableRowActionsProps> = ({ row, setFlag }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const { clubId = "" } = useParams();
  // Giả sử row.original chứa dữ liệu task theo kiểu TaskDetailDTO
  const taskData = row.original;

  return (
    <div className="flex space-x-2">
      {/* Nút Edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Edit size={18} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <EditTaskDialog
            taskId={taskData.taskId}
            clubId={clubId}
            onClose={() => setOpenEdit(false)}
            setFlag={setFlag}
          />
        </DialogContent>
      </Dialog>

      {/* Nút View */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Eye size={18} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <TaskDialogClubOwner initialData={row.original as any} setFlag={setFlag} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataRow;
