/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./row-actions";
import { Area } from "@/models/Area";

import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { useState } from "react";

// Định nghĩa columns cho DataTable
export const AreaColums: ColumnDef<Area>[] = [
  { accessorKey: "areaId", header: undefined, cell: undefined },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
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
      const [currentStatus] = useState(status);

      return (
        <div className="flex justify-center p-0">
          <div
            className={`flex items-center justify-center gap-1 py-2 px-2 rounded-md cursor-pointer ${
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
