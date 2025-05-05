/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2Icon,
  CircleCheck,
  CircleEllipsis,
  CircleX,
  LoaderCircle,
  Plus,
  XCircleIcon,
} from "lucide-react";
// import { useState } from "react";
import { Event } from "@/models/Event";
import { DataTableRowActions } from "./row-actions";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return {
        bg: "bg-[#CBF2DA]",
        text: "text-[#2F4F4F]",
        icon: <CheckCircle2Icon size={12} className="text-[#2F4F4F]" />,
      };
    case "INACTIVE":
      return {
        bg: "bg-[#FFF5BA]",
        text: "text-[#5A3825]",
        icon: <XCircleIcon size={12} className="text-[#5A3825]" />,
      };
    case "PENDING":
      return {
        bg: "bg-[#FFE6CC]",
        text: "text-[#CC6600]",
        icon: <CircleEllipsis size={12} className="text-[#CC6600]" />,
      };
    case "ENDED":
      return {
        bg: "bg-[#D1E7F3]",
        text: "text-[#1E4A7D]",
        icon: <CircleCheck size={12} className="text-[#1E4A7D]" />,
      };
    case "WAITING":
      return {
        bg: "bg-[#F9E3D1]",
        text: "text-[#9E5C3F]",
        icon: <CircleEllipsis size={12} className="text-[#9E5C3F]" />,
      };
    case "CANCELED":
      return {
        bg: "bg-[#eca6a6]",
        text: "text-[#b62e2e]",
        icon: <CircleX size={12} className="text-[#b62e2e]" />,
      };
    case "NOT_STARTED":
      return {
        bg: "bg-gray-100",
        text: "text-gray-500",
        icon: <LoaderCircle size={12} className="text-gray-500" />,
      };
    default:
      return { bg: "text-gray-100", text: "text-gray-500", icon: null };
  }
};

// Định nghĩa columns cho DataTable
export const EventColums = (
  setStatusFilter: (status: string | null) => void,
  selectedStatus: string,
  setSelectedStatus: (status: string) => void,
  open: boolean,
  setOpen: (open: boolean) => void,
  enableFilter?: boolean
): ColumnDef<Event>[] => [
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
    cell: ({ row }) => (
      <span className="truncate block max-w-[200px]">
        {row.getValue("eventName")}
      </span>
    ), // Hiển thị giá trị "Name"
  },

  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <span className="truncate block max-w-[200px]">
        {row.getValue("description")}
      </span>
    ),
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
        {enableFilter ? (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed">
                <Plus className="mr-2 h-4 w-4" />
                {selectedStatus || "All"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {["All", "ACTIVE", "ENDED"].map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => {
                    setStatusFilter(status === "All" ? "" : status);
                    setSelectedStatus(status);
                    setOpen(false);
                  }}
                >
                  {status === "All"
                    ? "All"
                    : status.charAt(0) + status.slice(1).toLowerCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DataTableColumnHeader column={column} title="Status" />
        )}
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status as string;
      const { bg, text, icon } = getStatusStyle(status);
      return (
        <div className="flex justify-center">
          <div
            className={`flex items-center gap-1 p-2 rounded-md ${bg} ${text}`}
          >
            {icon}
            <span className="text-sm font-semibold">{status}</span>
          </div>
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
