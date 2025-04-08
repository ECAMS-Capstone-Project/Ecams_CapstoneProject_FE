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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditPackageDialog } from "@/components/partial/admin/package/packageFormDialog";
import { AlertModal } from "@/components/ui/alert-modal";
import toast from "react-hot-toast";
import { usePackages } from "@/hooks/admin/usePackage";
import { Package } from "@/models/Package";
import { useQueryClient } from "@tanstack/react-query";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deactivePackage } = usePackages();
  const queryClient = useQueryClient();
  const onConfirm = async () => {
    setLoading(true);
    try {
      // await agent.Products.delete(data.productId);
      await deactivePackage(row.getValue("packageId"));
      queryClient.setQueryData(["packages"], (oldData: any) => {
        return oldData.map((item: Package) =>
          item.packageId === row.getValue("packageId")
            ? { ...item, status: 0 } // Cập nhật status trong bảng
            : item
        );
      });
    } catch (error: any) {
      const errorMessage = error.response.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error deleting package:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
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
            <span className="ml-2">Deactive</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <EditPackageDialog
            initialData={row.original as any}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
