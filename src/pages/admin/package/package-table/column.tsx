import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import type { Package } from "@/models/Package";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { DataTableRowActions } from "./row-actions";

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
export const packageColumns: ColumnDef<Package>[] = [
  {
    accessorKey: "packageId",
    header: undefined,
    cell: undefined, // Không cần hiển thị
  },
  {
    accessorKey: "packageName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <span>{row.getValue("packageName")}</span>, // Hiển thị giá trị "Name"
  },

  {
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration (Months)" />
    ),
    cell: ({ row }) => <span>{row.getValue("duration")} months</span>, // Hiển thị Duration kèm đơn vị
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => <span>{row.getValue("description")}</span>, // Hiển thị Duration kèm đơn vị
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="price" />
    ),
    cell: ({ row }) => (
      <span>
        {(row.getValue("price") as number).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </span>
    ), // Hiển thị giá theo định dạng USD
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
    accessorKey: "endOfSupportDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End of Support" />
    ),
    cell: ({ row }) => formatDate(row.getValue("endOfSupportDate")), // Hiển thị ngày kết thúc hỗ trợ ở định dạng ngày tháng
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
