/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2Icon,
  ChevronDown,
  CircleEllipsis,
  XCircleIcon,
} from "lucide-react";
import { DataTableRowActions } from "./row-actions";
import { University } from "@/models/University";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

// Định nghĩa columns cho DataTable
export const UniColumns: ColumnDef<University>[] = [
  {
    accessorKey: "universityName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="University Name" />
    ),
    cell: ({ row }) => <span>{row.getValue("universityName")}</span>, // Hiển thị giá trị "Name"
  },
  {
    accessorKey: "staffName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Staff" />
    ),
    cell: ({ row }) => <span>{row.getValue("staffName")}</span>,
  },
  {
    accessorKey: "contactEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <span>{row.getValue("contactEmail")}</span>, // Hiển thị Duration kèm đơn vị
  },
  {
    accessorKey: "shortName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Phone" />
    ),
    cell: ({ row }) => <span>{row.getValue("shortName")}</span>, // Hiển thị Duration kèm đơn vị
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={[
          { label: "Active", value: "ACTIVE" },
          { label: "Inactive", value: "INACTIVE" },
          { label: "Pending", value: "PENDING" },
        ]}
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const [currentStatus, setCurrentStatus] = useState(status);

      const handleStatusChange = async (newStatus: string) => {
        setCurrentStatus(newStatus);
        try {
          // Gửi API để cập nhật trạng thái
          // await updateUniversityStatus(row.original.id, newStatus); // Hàm này là một giả định
          toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
          console.error("Failed to update status:", error);
          toast.error("Failed to update status.");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className={`flex items-center justify-center gap-2 p-2 rounded-md cursor-pointer ${
                currentStatus === "ACTIVE"
                  ? "bg-[#CBF2DA] text-[#2F4F4F]"
                  : currentStatus === "INACTIVE"
                  ? "bg-[#FFF5BA] text-[#5A3825]"
                  : currentStatus === "PENDING"
                  ? "bg-[#FFE6CC] text-[#CC6600]"
                  : ""
              } w-full`}
            >
              {currentStatus === "ACTIVE" && (
                <CheckCircle2Icon size={18} className="text-[#2F4F4F]" />
              )}
              {currentStatus === "INACTIVE" && (
                <XCircleIcon size={18} className=" text-[#5A3825]" />
              )}
              {currentStatus === "PENDING" && (
                <CircleEllipsis size={18} className=" text-[#CC6600]" />
              )}
              <span>{currentStatus}</span>
              <ChevronDown size={16} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem
              onClick={() => handleStatusChange("ACTIVE")}
              className={`${
                currentStatus === "ACTIVE" ? "bg-[#CBF2DA]" : ""
              } cursor-pointer`}
            >
              <CheckCircle2Icon size={18} className=" text-[#2F4F4F]" /> Active
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange("INACTIVE")}
              className={`${
                currentStatus === "INACTIVE" ? "bg-[#FFF5BA]" : ""
              } cursor-pointer`}
            >
              <XCircleIcon size={18} className=" text-[#5A3825]" /> Inactive
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange("PENDING")}
              className={`${
                currentStatus === "PENDING" ? "bg-[#FFE6CC]" : ""
              } cursor-pointer`}
            >
              <CircleEllipsis size={18} className=" text-[#5A3825]" /> Pending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },

  {
    accessorKey: "logoLink",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logo Link" />
    ),
    cell: ({ row }) => <span>{row.getValue("logoLink")}</span>, // Hiển thị Duration kèm đơn vị
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
