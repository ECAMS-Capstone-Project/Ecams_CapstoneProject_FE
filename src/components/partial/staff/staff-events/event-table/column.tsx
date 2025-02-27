/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { CheckCircle2Icon, XCircleIcon, CircleEllipsis } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Event } from "@/models/Event";
import { DataTableRowActions } from "./row-actions";

// Định nghĩa columns cho DataTable
export const EventColums: ColumnDef<Event>[] = [
  { accessorKey: "eventId", header: undefined, cell: undefined },
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
    accessorKey: "eventName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event Name" />
    ),
    cell: ({ row }) => <span>{row.getValue("eventName")}</span>, // Hiển thị giá trị "Name"
  },

  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => <span>{row.getValue("description")}</span>,
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => <span>{row.getValue("location")}</span>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price");
      return (
        <span>
          {price?.toLocaleString() == "0"
            ? "Free"
            : price?.toLocaleString() + " VND"}{" "}
        </span>
      );
    },
  },
  {
    accessorKey: "maxParticipants",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Max Participants" />
    ),
    cell: ({ row }) => <span>{row.getValue("maxParticipants")} people</span>,
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
      const [, setIsDialogOpen] = useState(false);
      const reactivateUni = async () => {
        try {
          // Gửi API để cập nhật trạng thái
          //   await reactiveUni(row.original.universityId); // Hàm này là một giả định
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
                {/* <ChevronDown size={16} /> */}
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
