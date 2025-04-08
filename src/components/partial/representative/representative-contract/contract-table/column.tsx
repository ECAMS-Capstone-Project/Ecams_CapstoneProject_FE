/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, EyeIcon, XCircleIcon } from "lucide-react";
import { Contract } from "@/models/Contract";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

// Định nghĩa columns cho DataTable
export const contractColumn: ColumnDef<Contract>[] = [
  {
    accessorKey: "packageName",
    header: ({ column }) => (
      <div>
        <DataTableColumnHeader column={column} title="Package" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("packageName")}</div>,
  },
  {
    accessorKey: "universityName",
    header: ({ column }) => (
      <div>
        <DataTableColumnHeader column={column} title="University" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("universityName")}</div>,
  },
  {
    accessorKey: "signedDate",
    header: ({ column }) => (
      <div>
        <DataTableColumnHeader column={column} title="Signed Date" />
      </div>
    ),
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("signedDate")), "dd-MM-yyyy")}</div>
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <div>
        <DataTableColumnHeader column={column} title="Started Date" />
      </div>
    ),
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("startDate")), "dd-MM-yyyy")}</div>
    ),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <div>
        <DataTableColumnHeader column={column} title="Ended Date" />
      </div>
    ),
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("endDate")), "dd-MM-yyyy")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div>
        <DataTableColumnHeader column={column} title="Status" />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isActive = status == "1";
      const isInactive = status == "0";

      return (
        <div
          className={`flex items-center justify-center gap-2 p-2 rounded-md w-full ${
            isActive
              ? "bg-[#CBF2DA] text-[#2F4F4F]"
              : isInactive
              ? "bg-[#FFF5BA] text-[#5A3825]"
              : ""
          }`}
        >
          {isActive && (
            <CheckCircle2Icon size={20} className="text-[#2F4F4F]" />
          )}
          {isInactive && <XCircleIcon size={20} className="text-[#5A3825]" />}
          <span>{status == "1" ? "Active" : "Inactive"}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <div className="flex justify-center w-full">
          <EyeIcon
            size={24}
            className="cursor-pointer"
            onClick={() =>
              navigate(`/representative/contract/${row.original.contractId}`, {
                state: { rowData: row.original },
              })
            }
          />
        </div>
      );
    },
  },
];
