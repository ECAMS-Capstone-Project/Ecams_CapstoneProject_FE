/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, Eye, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ClubResponseDTO } from "@/api/club-owner/ClubByUser";
import { DataTableClubRowActions } from "./row-actions";
// import useAuth from "@/hooks/useAuth";

export const clubColumn = (): ColumnDef<ClubResponseDTO>[] => {
  // const { user } = useAuth(); // Get the user from useAuth

  return [
    {
      accessorKey: "clubName",
      header: ({ column }) => (
        <div >
          <DataTableColumnHeader column={column} title="Club Name" />
        </div>
      ),
      cell: ({ row }) => <div >{row.getValue("clubName")}</div>,
    },
    {
      accessorKey: "foundingDate",
      header: ({ column }) => (
        <div >
          <DataTableColumnHeader column={column} title="Founding Date" />
        </div>
      ),
      cell: ({ row }) => <div >{row.getValue("foundingDate") ? format(row.getValue("foundingDate"), 'dd/MM/yyyy') : "No time"}</div>,
    },
    {
      accessorKey: "contactEmail",
      header: ({ column }) => (
        <div >
          <DataTableColumnHeader column={column} title="contactEmail" />
        </div>
      ),
      cell: ({ row }) => <div >{row.getValue("contactEmail")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="text-center">
          <DataTableFacetedFilter
            column={column}
            title="Status"
            options={[
              { label: "In progress", value: false },
              { label: "Completed", value: true },
            ]}
          />
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as boolean;

        return (
          <div
            className={`flex items-center justify-center gap-2 p-2 rounded-md w-3/4 ${row.getValue("status") == "INATIVE"
              ? "bg-[#D6E4FF] text-[#007BFF]"
              : row.getValue("status") == "ACTIVE"
                ? "bg-[#CBF2DA] text-[#2F4F4F]"
                : ""
              }`}
            style={{ margin: "0 auto" }}
          >
            {row.getValue("status") == "INATIVE" && <Clock size={20} className="text-[#007BFF]" />}
            {row.getValue("status") == "ACTIVE" && <CheckCircle2Icon size={20} className="text-[#2F4F4F]" />}
            <span>{status ? "Completed" : "In progress"}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div>Action</div>,
      cell: ({ row }) => (
        <>
          <Dialog>
            <DialogTrigger>
              <div className="flex justify-center">
                <Eye size={18} />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DataTableClubRowActions row={row} />
            </DialogContent>
          </Dialog>
        </>
      ),
    },
  ];
};
