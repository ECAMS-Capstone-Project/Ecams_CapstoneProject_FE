/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, ChevronDown, XCircleIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { Policy } from "@/models/Policy";
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
export const PolicyColumns: ColumnDef<Policy>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <span>{row.getValue("title")}</span>, // Hiển thị giá trị "Name"
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate block">
        {row.getValue("description")}
      </span>
    ),
  },

  {
    accessorKey: "effectiveAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Effective Date" />
    ),
    cell: ({ row }) => formatDate(row.getValue("effectiveAt")),
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="flex items-center justify-center">
        <DataTableFacetedFilter
          column={column}
          title="Status"
          options={[
            { label: "Active", value: true },
            { label: "Inactive", value: false },
          ]}
        />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean; // Lấy giá trị boolean trực tiếp
      console.log("status", status);
      const isActive = status === true;
      const isInactive = status === false;
      const [currentStatus, setCurrentStatus] = useState(status);

      const reactivateUni = async () => {
        try {
          // Gửi API để cập nhật trạng thái
          // await reactiveUni(row.original.universityId); // Hàm này là một giả định
          toast.success("Reactivate University Successfully.");
          setCurrentStatus(true); // Đặt lại trạng thái là true
        } catch (error) {
          console.error("Failed to update status:", error);
          toast.error("Failed to update status.");
        }
      };

      return (
        <div className="flex justify-center p-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-md cursor-pointer ${
                  isActive
                    ? "bg-[#CBF2DA] text-[#2F4F4F]"
                    : isInactive
                    ? "bg-[#FFF5BA] text-[#5A3825]"
                    : ""
                } w-3/4`}
              >
                {isActive && (
                  <CheckCircle2Icon size={12} className="text-[#2F4F4F]" />
                )}
                {isInactive && (
                  <XCircleIcon size={12} className=" text-[#5A3825]" />
                )}

                <span>{currentStatus ? "Active" : "Inactive"}</span>
                <ChevronDown size={16} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem
                onClick={() => reactivateUni()}
                className={`${
                  currentStatus === true ? "bg-[#CBF2DA]" : ""
                } cursor-pointer`}
              >
                <CheckCircle2Icon size={18} className=" text-[#2F4F4F]" />{" "}
                Active
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setCurrentStatus(false)} // Cập nhật lại status thành false
                className={`${
                  currentStatus === false ? "bg-[#FFF5BA]" : ""
                } cursor-pointer`}
              >
                <XCircleIcon size={18} className=" text-[#5A3825]" /> Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
