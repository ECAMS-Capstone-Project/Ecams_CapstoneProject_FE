/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";

import { AlertModal } from "@/components/ui/alert-modal";
import toast from "react-hot-toast";
import { useAreas } from "@/hooks/staff/Area/useArea";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deleteArea, refetchArea } = useAreas();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const onConfirm = async () => {
    setLoading(true);
    try {
      await deleteArea(row.getValue("areaId"));
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      await refetchArea();
    } catch (error: any) {
      const errorMessage = error.response.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error deactivating area:", error);
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
      <button
        className="bg-transparent border-none"
        onClick={() => {
          row.getValue("status") === "PENDING"
            ? navigate(
                `/representative/event/request/${row.getValue("eventId")}`
              )
            : navigate(`/representative/event/${row.getValue("eventId")}`);
        }}
      >
        <EyeIcon className="mr-2 h-4 w-4 cursor-pointer text-black" />
      </button>

      {/* Chỉ mở dialog khi eventDetail có dữ liệu */}

      {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-hidden p-4">
          {eventDetail?.data ? (
            eventDetail.data.status === "PENDING" ? (
              <RequestEventDetailDialog
                event={eventDetail.data}
                onClose={() => setDialogOpen(false)}
              />
            ) : (
              ""
            )
          ) : (
            <div>No event details available</div>
          )}
        </DialogContent>
      </Dialog> */}
    </>
  );
}
