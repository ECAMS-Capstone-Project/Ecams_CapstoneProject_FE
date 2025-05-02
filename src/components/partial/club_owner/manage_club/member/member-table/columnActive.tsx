/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { ClubMemberDTO } from "@/api/club-owner/ClubByUser";
import RoleDropdownCell from "../RoleDropdownCell";
import { format, isValid } from "date-fns";
import { ActionCell } from "./ActionCell";


export const memberActiveColumn = (
  isClubOwner: boolean,
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
        const role = row.getValue("clubRoleName") || "CLUB_MEMBER";
        return (
          <div className="flex justify-center">
            <RoleDropdownCell
              role={role as string}
              row={row}
              isClubOwner={isClubOwner}
            />
          </div>
        );
      },
    },
  ];

  const conditionalColumn: ColumnDef<ClubMemberDTO> = isClubOwner
    ? {
        id: "actions",
        header: () => <div className="text-center">Action</div>,
        cell: ({ row }) => <ActionCell row={row} setFlag={setFlag} />,
      }
    : {
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
      };

  return [...baseColumns, conditionalColumn];
};
