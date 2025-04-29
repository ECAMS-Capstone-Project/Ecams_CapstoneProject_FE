import { ColumnDef } from "@tanstack/react-table";
import { EventRefundDTO } from "@/models/Event";
import { CellAction } from "./cell-action";
// import { CellAction } from "./cell-action";

interface ColumnsProps {
  onView: (data: EventRefundDTO) => void;
  eventPrice: number;
}

export const columns = ({
  onView,
  eventPrice,
}: ColumnsProps): ColumnDef<EventRefundDTO>[] => [
  {
    accessorKey: "fullname",
    header: "Student Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phonenumber",
    header: "Phone number",
  },
  {
    accessorKey: "price",
    header: "Amount",
    cell: () => {
      return `${eventPrice.toLocaleString()} VND`;
    },
  },
  {
    accessorKey: "refundStatus",
    header: "Status",
    cell: ({ row }) => {
      const refundStatus = row.original.refundStatus;
      const refundInfoStatus = row.original.refundInforStatus; // Kiểm tra refundInfoStatus

      // Xử lý logic cho refundStatus
      const status =
        refundInfoStatus === "NOT_YET"
          ? "NOT_YET" // Nếu refundInfoStatus là NOT_YET, trạng thái là NOT_YET
          : refundStatus; // Nếu không, lấy giá trị refundStatus ban đầu

      return (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            status === "NOT_YET"
              ? "bg-gray-100 text-gray-800" // Sử dụng màu xám cho trạng thái NOT_YET
              : status === "PENDING"
              ? "bg-yellow-100 text-yellow-800" // Sử dụng màu vàng cho trạng thái PENDING
              : status === "REFUNDED"
              ? "bg-green-100 text-green-800" // Sử dụng màu xanh lá cho trạng thái REFUNDED
              : "bg-red-100 text-red-800" // Sử dụng màu đỏ cho các trạng thái còn lại
          }`}
        >
          {status}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} onView={onView} />,
  },
];
