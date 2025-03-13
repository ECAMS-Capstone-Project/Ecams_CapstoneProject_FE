import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DataTableRowActions } from "./row-actions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ClubMemberDTO } from "@/api/club-owner/ClubByUser";
import RoleDropdownCell from "../RoleDropdownCell";

export const memberActiveColumn = (
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
): ColumnDef<ClubMemberDTO>[] => {
  // const { user } = useAuth(); // Get the user from useAuth

  return [
    {
      accessorKey: "studentId",
      header: ({ column }) => (
        <div >
          <DataTableColumnHeader column={column} title="Student ID" />
        </div>
      ),
      cell: ({ row }) => <div >{row.getValue("studentId")}</div>,
    },
    {
      accessorKey: "fullname",
      header: ({ column }) => (
        <div >
          <DataTableColumnHeader column={column} title="Full Name" />
        </div>
      ),
      cell: ({ row }) => <div >{row.getValue("fullname")}</div>,
      // cell: ({ row }) => <div >{row.getValue("gender") == 'Female' ? <Person color="error" style={{ color: "red" }} /> : <Person style={{ color: "#2D3748" }} />}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div >
          <DataTableColumnHeader column={column} title="Email" />
        </div>
      ),
      cell: ({ row }) => <div >{row.getValue("email")}</div>,
    },
    {
      accessorKey: "clubRoleName",
      header: ({ column }) => (
        <div className="text-center" >
          <DataTableColumnHeader column={column} title="Role" />
        </div>
      ),
      cell: ({ row }) => {
        const role = row.getValue("clubRoleName") || "CLUB_MEMBER";
        return (
          <div className="flex justify-center">
            <RoleDropdownCell
              role={role as string}
              row={row}
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div >Action</div>,
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
}
