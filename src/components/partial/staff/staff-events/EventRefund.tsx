/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Event, EventRefundDTO } from "@/models/Event";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { columns } from "./columns";
import { RefundRequestDialog } from "./RefundRequestDialog";
import { DataTable } from "@/components/ui/refund-data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventRefundProps {
  event: Event;
}

export const EventRefund: React.FC<EventRefundProps> = ({ event }) => {
  const [selectedRequest, setSelectedRequest] = useState<EventRefundDTO | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { refundEvent, getAllRefundList } = useEvents();
  const queryClient = useQueryClient();
  // const { user } = useAuth();
  const { eventId = "" } = useParams();

  const { data: refundsData, isLoading } = getAllRefundList(
    eventId,
    pageNumber,
    pageSize,
    statusFilter == "all" ? "" : statusFilter
  );
  const refunds = refundsData?.data?.data || [];

  const handleViewRequest = (request: EventRefundDTO) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const handleUploadBill = async (file: File) => {
    if (selectedRequest) {
      try {
        const formData = new FormData();
        formData.append("EvidenceRefund", file);
        formData.append("RefundId", selectedRequest.refundId);

        await refundEvent(formData);
        queryClient.invalidateQueries({
          queryKey: [
            "refunds",
            event.eventId,
            statusFilter,
            pageNumber,
            pageSize,
          ],
        });

        setIsViewDialogOpen(false);
      } catch (error: any) {
        console.error("Lỗi khi upload bill:", error);
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="px-2 py-4 sm:px-2 md:px-2">
      <div className="flex items-center justify-between mb-4">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPageNumber(1); // Reset về trang 1 khi thay đổi filter
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns({
          onView: handleViewRequest,
          eventPrice: event.price,
        })}
        data={refunds}
        searchKey="fullname"
        isLoading={isLoading}
        pageNumber={pageNumber}
        pageSize={pageSize}
        onPageChange={setPageNumber}
        onPageSizeChange={setPageSize}
        totalPages={refundsData?.data?.totalPages || 1}
      />

      <RefundRequestDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        request={selectedRequest}
        onUploadBill={handleUploadBill}
        event={event}
      />
    </div>
  );
};
