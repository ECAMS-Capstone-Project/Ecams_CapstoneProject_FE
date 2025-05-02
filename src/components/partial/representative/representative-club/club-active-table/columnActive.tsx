/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ClubMemberDTO } from "@/api/club-owner/ClubByUser";
import { format, isValid } from "date-fns";
import { DataTableRowActiveActions } from "./row-actions-active";

export const memberActiveColumn = (
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
): ColumnDef<ClubMemberDTO>[] => {
  const baseColumns: ColumnDef<ClubMemberDTO>[] = [
    {
      accessorKey: "studentId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Student ID" />
      ),
      cell: ({ row }) => <div>{row.getValue("studentId")}</div>,
    },
    {
      accessorKey: "fullname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Full Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("fullname")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "clubRoleName",
      header: ({ column }) => (
        <div className="text-center">
          <DataTableColumnHeader column={column} title="Position" />
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div
            className={`w-full ${
              row.getValue("clubRoleName") === "CLUB_OWNER"
                ? "w-[180px] py-2 rounded-md text-center bg-slate-700 text-white"
                : "w-[180px] py-2 rounded-md text-center bg-[#88f0b0] text-[#2F4F4F]"
            }`}
          >
            {row.getValue("clubRoleName")}
          </div>
        );
      },
    },

    {
      accessorKey: "joinedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Join Date" />
      ),
      cell: ({ row }) => {
        const value = row.getValue("joinedAt");
        const date = new Date(value as string | number | Date);
        return (
          <div>
            {value && isValid(date) ? format(date, "dd/MM/yyyy") : "N/A"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div>Action</div>,
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger>
            <div className="flex justify-center">
              <Eye size={18} />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DataTableRowActiveActions row={row} setFlag={setFlag} />
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return [...baseColumns];
};
