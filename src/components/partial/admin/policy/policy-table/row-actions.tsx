/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { EyeIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/ui/alert-modal";
import toast from "react-hot-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditPolicyDialog } from "../PolicyFormDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setActiveTab?: (tab: string) => void;
}

export function DataTableRowActions<TData>({
  row,
}: // setActiveTab,
DataTableRowActionsProps<TData>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(row);

  const onConfirm = async () => {
    setLoading(true);
    try {
      // await agent.Products.delete(data.productId);
      toast.success("Package delete successfully.");
    } catch (error: any) {
      const errorMessage = error.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error deleting package:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // const handleSuccess = () => {
  //   // setActiveTab("registered"); // Chuyển tab (nếu logic yêu cầu)
  //   setIsDialogOpen(false); // Đóng dialog chính
  // };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">{"Open Menu"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          {/* Trigger mở dialog */}
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <EyeIcon className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>

          {/* Delete */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="ml-2">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <EditPolicyDialog initialData={row.original as any} />
        </DialogContent>
      </Dialog>
    </>
  );
}
