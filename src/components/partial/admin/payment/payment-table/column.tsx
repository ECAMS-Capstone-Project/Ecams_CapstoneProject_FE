import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { DataTableRowActions } from "./row-actions";
import { Transaction } from "@/models/Payment";

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleString("en-US", options);
};
// Định nghĩa columns cho DataTable
export const paymentColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "transactionId",
    header: undefined,
    cell: undefined, // Không cần hiển thị
  },
  {
    accessorKey: "methodId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Method" />
    ),
    cell: ({ row }) => <span>{row.getValue("methodId")}</span>, // Hiển thị giá trị "Name"
  },

  {
    accessorKey: "universityPackageId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Package" />
    ),
    cell: ({ row }) => <span>{row.getValue("universityPackageId")}</span>, // Hiển thị Duration kèm đơn vị
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => <span>{row.getValue("amount")}</span>, // Hiển thị Duration kèm đơn vị
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={[
          { label: "Active", value: true },
          { label: "Inactive", value: false },
        ]}
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isActive = status == "1";
      const isInactive = status == "0";

      return (
        <div
          className={`flex items-center justify-center gap-2 p-2 rounded-md ${
            isActive
              ? "bg-[#CBF2DA] text-[#2F4F4F]"
              : isInactive
              ? "bg-[#FFF5BA] text-[#5A3825]"
              : ""
          } w-full`} // Đặt width cố định
        >
          {isActive && (
            <CheckCircle2Icon size={20} className="h-5 w-5 text-[#2F4F4F]" />
          )}
          {isInactive && (
            <XCircleIcon size={20} className="h-5 w-5 text-[#5A3825]" />
          )}
          <span>{status == "1" ? "Active" : "Inactive"}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId); // Giá trị boolean thực tế
      return filterValue == String(value);
    },
  },

  {
    accessorKey: "paymentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Date" />
    ),
    cell: ({ row }) => formatDate(row.getValue("paymentDate")), // Hiển thị ngày kết thúc hỗ trợ ở định dạng ngày tháng
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
