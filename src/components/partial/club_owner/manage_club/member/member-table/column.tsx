import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Person } from "@mui/icons-material";
import { DataTableRowActions } from "./row-actions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { User } from "@/models/User";

export const memberColumn = (
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
): ColumnDef<User>[] => [
    {
      accessorKey: "userId",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Student Id" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center w-full">{row.getValue("userId")}</div>,
    },
    {
      accessorKey: "fullname",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Full name" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center w-full">{row.getValue("fullname")}</div>,
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
      accessorKey: "dateOfBirth",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Date of birth" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center w-full">{row.getValue("dateOfBirth") || "22/07/2003"}</div>,
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Gender" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center w-full">{row.getValue("gender") == 'Female' ? <Person color="error" style={{ color: "red" }} /> : <Person style={{ color: "#2D3748" }} />}</div>,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Role" />
        </div>
      ),
      cell: ({ row }) => {
        const role = row.getValue("role") || "Member";
        const isClubOwner = role === "Club Owner";
        const isMember = role === "Member";

        return (
          <div
            className={`flex items-center justify-center gap-2 p-2 rounded-md w-3/4 ${isClubOwner
              ? "bg-red-500 text-white"
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
