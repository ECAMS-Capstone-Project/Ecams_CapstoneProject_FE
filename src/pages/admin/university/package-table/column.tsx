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
    accessorKey: "PackageId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Package Id" />
    ),
    cell: ({ row }) => <span>{row.getValue("PackageId")}</span>, // Hiển thị giá trị "Name"
  },
  {
    accessorKey: "Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <span>{row.getValue("Name")}</span>, // Hiển thị giá trị "Name"
  },

  {
    accessorKey: "Duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration (Months)" />
    ),
    cell: ({ row }) => <span>{row.getValue("Duration")} months</span>, // Hiển thị Duration kèm đơn vị
  },
  {
    accessorKey: "Description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => <span>{row.getValue("Description")} days</span>, // Hiển thị Duration kèm đơn vị
  },
  {
    accessorKey: "Price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <span>
        {(row.getValue("Price") as number).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </span>
    ), // Hiển thị giá theo định dạng USD
  },
  {
    accessorKey: "Status",
    header: ({ column }) => (
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={[
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" },
        ]}
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("Status") as string;
      const isActive = status === "Active";
      const isInactive = status === "Inactive";

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
          <span>{status}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "EndOfSupportDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End of Support" />
    ),
    cell: ({ row }) => formatDate(row.getValue("EndOfSupportDate")), // Hiển thị ngày kết thúc hỗ trợ ở định dạng ngày tháng
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
