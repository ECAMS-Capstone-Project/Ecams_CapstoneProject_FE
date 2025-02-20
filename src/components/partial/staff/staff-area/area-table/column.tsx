/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./row-actions";
import { Area } from "@/models/Area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { CheckCircle2Icon, XCircleIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// Định nghĩa columns cho DataTable
export const AreaColums: ColumnDef<Area>[] = [
  { accessorKey: "areaId", header: undefined, cell: undefined },
  {
    accessorKey: "imageUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-2 justify-center">
          <img
            src={row.original.imageUrl}
            alt={"Product Image"}
            className="w-12 h-12 object-cover"
          />
        </div>
      );
    }, // Không cần hiển thị
  },
  {
    accessorKey: "universityName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="University" />
    ),
    cell: ({ row }) => (
      <span className="truncate max-w-lg block px-5">
        {row.getValue("universityName")}
      </span>
    ), // Hiển thị giá trị "Name"
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <span className="truncate max-w-[200px] block ">
        {row.getValue("description")}
      </span>
    ),
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacity" />
    ),
    cell: ({ row }) => <span>{row.getValue("capacity")} people</span>,
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
      const status = row.getValue("status") as boolean;
      const [currentStatus, setCurrentStatus] = useState(status);
      const [, setIsDialogOpen] = useState(false);

      const updateAreaStatus = async (newStatus: boolean) => {
        try {
          // await updateAreaStatusAPI(row.original.areaId, newStatus); // ✅ Gọi API cập nhật trạng thái
          toast.success(
            `Area ${newStatus ? "Activated" : "Deactivated"} Successfully.`
          );
          setCurrentStatus(newStatus);
          // refreshData(); // 🔥 Làm mới danh sách sau khi cập nhật
        } catch (error) {
          console.error("❌ Failed to update status:", error);
          toast.error("❌ Failed to update status.");
        }
      };

      return (
        <div className="flex justify-center p-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-md cursor-pointer ${
                  currentStatus
                    ? "bg-[#CBF2DA] text-[#2F4F4F]" // Active
                    : "bg-[#FFF5BA] text-[#5A3825]" // Inactive
                } w-auto`}
              >
                {currentStatus ? (
                  <CheckCircle2Icon size={12} className="text-[#2F4F4F]" />
                ) : (
                  <XCircleIcon size={12} className=" text-[#5A3825]" />
                )}
                <span>{currentStatus ? "Active" : "Inactive"}</span>
                <ChevronDown size={16} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem
                onClick={() => updateAreaStatus(true)}
                className={`${
                  currentStatus ? "bg-[#CBF2DA]" : ""
                } cursor-pointer`}
              >
                <CheckCircle2Icon size={18} className=" text-[#2F4F4F]" />
                Active
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setIsDialogOpen(true);
                }}
                className={`${
                  !currentStatus ? "bg-[#FFF5BA]" : ""
                } cursor-pointer`}
              >
                <XCircleIcon size={18} className=" text-[#5A3825]" />
                Inactive
              </DropdownMenuItem>
              {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DenyRequest
                  areaId={row.original.areaId}
                  onClose={() => {
                    setIsDialogOpen(false);
                  }}
                  dialogAction={"deactivate"}
                  onSuccess={() => {
                    setCurrentStatus(false);
                    refreshData();
                  }}
                />
              </Dialog> */}
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
