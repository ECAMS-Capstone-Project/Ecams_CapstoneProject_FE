/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, Eye, Clock } from "lucide-react";
import { DataTableRowActions } from "./row-actions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Task } from "@/models/Task";
import { format } from "date-fns";
// import useAuth from "@/hooks/useAuth";

export const taskColumn = (
  isClubOwner: boolean,
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
): ColumnDef<Task>[] => {
  // const { user } = useAuth(); // Get the user from useAuth

  return [
    {
      accessorKey: "taskName",
      header: ({ column }) => (
        <div >
          <DataTableColumnHeader column={column} title="Task Name" />
        </div>
      ),
      cell: ({ row }) => <div >{row.getValue("taskName")}</div>,
    },
    {
      accessorKey: "starttime",
      header: ({ column }) => (
        <div >
          <DataTableColumnHeader column={column} title="Start Date" />
        </div>
      ),
      cell: ({ row }) => <div >{format(row.getValue("deadline"), 'HH:mm:ss')}</div>,
    },
    {
      accessorKey: "deadline",
      header: ({ column }) => (
        <div >
          <DataTableColumnHeader column={column} title="Deadline" />
        </div>
      ),
      cell: ({ row }) => <div >{format(row.getValue("deadline"), 'HH:mm - dd/MM/yyyy')}</div>,
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
        const isInProgress = status === false;
        const isCompleted = status === true;

        return (
          <div
            className={`flex items-center justify-center gap-2 p-2 rounded-md w-3/4 ${isInProgress
              ? "bg-[#D6E4FF] text-[#007BFF]"
              : isCompleted
                ? "bg-[#CBF2DA] text-[#2F4F4F]"
                : ""
              }`}
            style={{ margin: "0 auto" }}
          >
            {isInProgress && <Clock size={20} className="text-[#007BFF]" />}
            {isCompleted && <CheckCircle2Icon size={20} className="text-[#2F4F4F]" />}
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
              <DataTableRowActions row={row} setFlag={setFlag} isClubOwner={isClubOwner} />
            </DialogContent>
          </Dialog>
        </>
      ),
    },
  ];
};
