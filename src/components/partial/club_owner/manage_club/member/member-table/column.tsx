import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DataTableRowActions } from "./row-actions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ClubMemberDTO } from "@/api/club-owner/ClubByUser";

export const memberColumn = (
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
): ColumnDef<ClubMemberDTO>[] => [
    {
      accessorKey: "studentId",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Student ID" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center w-full">{row.getValue("studentId")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Email" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center w-full">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "fullname",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Full Name" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center w-full">{row.getValue("fullname")}</div>,
      // cell: ({ row }) => <div className="text-center w-full">{row.getValue("gender") == 'Female' ? <Person color="error" style={{ color: "red" }} /> : <Person style={{ color: "#2D3748" }} />}</div>,
    },
    {
      accessorKey: "clubRoleName",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Role" />
        </div>
      ),
      cell: ({ row }) => {
        const role = row.getValue("clubRoleName") || "CLUB_MEMBER";
        const isClubOwner = role === "CLUB_OWNER";
        const isMember = role === "CLUB_MEMBER";

        return (
          <div
            className={`flex items-center justify-center gap-2 p-2 rounded-md w-3/4 ${isClubOwner
              ? "bg-black text-white"
              : isMember
                ? "bg-[#4DB848]  text-white"
                : ""
              }`}
            style={{ margin: "0 auto" }}
          >
            <span>{role as string}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center w-full">Action</div>,
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger>
            <div className="flex justify-center">
              <Eye size={18} />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DataTableRowActions row={row} setFlag={setFlag} />
          </DialogContent>
        </Dialog>
      ),
    },
  ];
