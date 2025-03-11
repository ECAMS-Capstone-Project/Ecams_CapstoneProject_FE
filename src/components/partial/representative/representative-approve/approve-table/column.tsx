/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, Eye, XCircleIcon } from "lucide-react";
import StudentRequest from "@/models/StudentRequest";
import { DataTableRowActions } from "./row-actions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const contractColumn = (setFlag?: React.Dispatch<React.SetStateAction<boolean>>): ColumnDef<StudentRequest>[] => [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <div >
        <DataTableColumnHeader column={column} title="Email" />
      </div>
    ),
    cell: ({ row }) => <div >{row.getValue("email")} </div>,
  },
  {
    accessorKey: "fullname",
    header: ({ column }) => (
      <div >
        <DataTableColumnHeader column={column} title="Full Name" />
      </div>
    ),
    cell: ({ row }) => <div >{row.getValue("fullname")}</div>,
  },
  {
    accessorKey: "universityName",
    header: ({ column }) => (
      <div >
        <DataTableColumnHeader column={column} title="University" />
      </div>
    ),
    cell: ({ row }) => <div >{row.getValue("universityName")}</div>,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <div >
        <DataTableColumnHeader column={column} title="Join Date" />
      </div>
    ),
    cell: ({ row }) => <div >{String(row.getValue("startDate")).split("T")[0]}</div>,
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <div >
        <DataTableColumnHeader column={column} title="Left Date" />
      </div>
    ),
    cell: ({ row }) => <div >{String(row.getValue("endDate") || "Not yet").split("T")[0]}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div >
        <DataTableFacetedFilter
          column={column}
          title="Status"
          options={[
            { label: "Active", value: true },
            { label: "Inactive", value: false },
            { label: "Pending", value: false },
          ]}
        />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isActive = status == "ACTIVE";
      const isInactive = status == "PENDING";
      const isPending = status == "INACTIVE";
      const isChecking = status == "CHECKING";

      return (
        <div className={`flex items-center justify-center gap-2 p-2 rounded-md ${isActive
          ? "bg-[#CBF2DA] text-[#2F4F4F]"
          : isInactive
            ? "bg-[#FFF5BA] text-[#5A3825]"
            : isChecking
              ? "bg-[#D6E4FF] text-[#007BFF]"
              : isPending
                ? "bg-[#FFEFD5] text-[#FFC107]"
                : ""
          } w-3/4`} style={{ margin: "0 auto" }}>
          {isActive && <CheckCircle2Icon size={20} className="text-[#2F4F4F]" />}
          {isInactive && <XCircleIcon size={20} className="text-[#5A3825]" />}
          {isPending && <XCircleIcon size={20} className="text-[#FFC107 ]" />}
          {isChecking && <XCircleIcon size={20} className="text-[#007BFF]" />}
          <span>{status}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (<div >
      Action
    </div>),
    cell: ({ row }) =>
      <>
        <Dialog>
          <DialogTrigger>
            <div style={{ margin: "0 auto" }}>
              <Eye size={18} />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DataTableRowActions row={row} setFlag={setFlag} />
          </DialogContent>
        </Dialog>
      </>
  },
];


