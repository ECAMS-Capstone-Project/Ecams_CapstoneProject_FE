/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, Eye, Clock } from "lucide-react";
import { DataTableRowActions } from "./row-actions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Task } from "@/models/Task";
import { format } from "date-fns";

export const taskColumn = (
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
): ColumnDef<Task>[] => [
    {
      accessorKey: "taskName",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Task Name" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center w-full">{row.getValue("taskName")}</div>,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Description" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center w-full">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="text-center w-full">
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
      accessorKey: "deadline",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Deadline" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center w-full">{format(row.getValue("deadline"), 'dd/MM/yyyy HH:mm:ss')}</div>,
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
