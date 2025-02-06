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
import { reactiveUni } from "@/api/agent/UniversityAgent";
import { Dialog } from "@/components/ui/dialog";
import { DenyRequest } from "../DenialDialog";

// Định nghĩa columns cho DataTable
export const UniColumns: ColumnDef<University>[] = [
  {
    accessorKey: "logoLink",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logo Link" />
    ),
    cell: ({ row }) => {
      <div className="flex flex-wrap gap-2">
        <img
          src={row.original.logoLink}
          alt={"Product Image"}
          className="w-10 h-10 object-cover"
        />
      </div>;
    }, // Hiển thị Duration kèm đơn vị
  },
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
      <DataTableColumnHeader column={column} title="Short Name" />
    ),
    cell: ({ row }) => <span>{row.getValue("shortName")}</span>, // Hiển thị Duration kèm đơn vị
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="flex items-center justify-center">
        <DataTableFacetedFilter
          column={column}
          title="Status"
          options={[
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
            { label: "Pending", value: "PENDING" },
          ]}
        />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const [currentStatus, setCurrentStatus] = useState(status);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const reactivateUni = async () => {
        try {
          // Gửi API để cập nhật trạng thái
          await reactiveUni(row.original.universityId); // Hàm này là một giả định
          toast.success("Reactivate University Successfully.");
          setCurrentStatus("ACTIVE");
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
                  currentStatus === "ACTIVE"
                    ? "bg-[#CBF2DA] text-[#2F4F4F]"
                    : currentStatus === "INACTIVE"
                    ? "bg-[#FFF5BA] text-[#5A3825]"
                    : currentStatus === "PENDING"
                    ? "bg-[#FFE6CC] text-[#CC6600]"
                    : ""
                } w-auto`}
              >
                {currentStatus === "ACTIVE" && (
                  <CheckCircle2Icon size={12} className="text-[#2F4F4F]" />
                )}
                {currentStatus === "INACTIVE" && (
                  <XCircleIcon size={12} className=" text-[#5A3825]" />
                )}
                {currentStatus === "PENDING" && (
                  <CircleEllipsis size={12} className=" text-[#CC6600]" />
                )}
                <span>{currentStatus}</span>
                <ChevronDown size={16} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem
                onClick={() => reactivateUni()}
                className={`${
                  currentStatus === "ACTIVE" ? "bg-[#CBF2DA]" : ""
                } cursor-pointer`}
              >
                <CheckCircle2Icon size={18} className=" text-[#2F4F4F]" />{" "}
                Active
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setIsDialogOpen(true);
                }}
                className={`${
                  currentStatus === "INACTIVE" ? "bg-[#FFF5BA]" : ""
                } cursor-pointer`}
              >
                <XCircleIcon size={18} className=" text-[#5A3825]" /> Inactive
              </DropdownMenuItem>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DenyRequest
                  universityId={row.original.universityId}
                  onClose={() => {
                    setIsDialogOpen(false);
                  }}
                  dialogAction={"deactive"}
                  onSuccess={() => setCurrentStatus("INACTIVE")}
                />
              </Dialog>
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
