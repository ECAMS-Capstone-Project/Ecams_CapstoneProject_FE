/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, Eye, XCircleIcon, Clock } from "lucide-react";
import { DataTableRowActions } from "./row-actions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Task } from "@/models/Task";

export const taskColumn = (
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
): ColumnDef<Task>[] => [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Task ID" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center w-full">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Title" />
        </div>
      ),
      cell: ({ row }) => <div className="text-left w-full">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "club",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableColumnHeader column={column} title="Club" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center w-full">{row.getValue("club")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="text-center w-full">
          <DataTableFacetedFilter
            column={column}
            title="Status"
            options={[
              { label: "In progress", value: "In progress" },
              { label: "Completed", value: "Completed" },
              { label: "Pending", value: "Pending" },
            ]}
          />
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const isInProgress = status === "In progress";
        const isCompleted = status === "Submitted";
        const isPending = status === "Pending";

        return (
          <div
            className={`flex items-center justify-center gap-2 p-2 rounded-md w-3/4 ${isInProgress
              ? "bg-[#D6E4FF] text-[#007BFF]"
              : isCompleted
                ? "bg-[#CBF2DA] text-[#2F4F4F]"
                : isPending
                  ? "bg-[#FFEFD5] text-[#FFC107]"
                  : ""
              }`}
            style={{ margin: "0 auto" }}
          >
            {isInProgress && <Clock size={20} className="text-[#007BFF]" />}
            {isCompleted && <CheckCircle2Icon size={20} className="text-[#2F4F4F]" />}
            {isPending && <XCircleIcon size={20} className="text-[#FFC107]" />}
            <span>{status}</span>
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
      cell: ({ row }) => <div className="text-center w-full">{row.getValue("deadline")}</div>,
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
