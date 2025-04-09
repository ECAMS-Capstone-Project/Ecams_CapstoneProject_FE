/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, Eye, Clock, Search } from "lucide-react";
import { DataTableRowActions } from "./row-actions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Task } from "@/models/Task";
import { format } from "date-fns";
// import useAuth from "@/hooks/useAuth";

export const taskMemberColumn = (
  isClubOwner: boolean,
  setFlag: React.Dispatch<React.SetStateAction<boolean>>
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
      accessorKey: "startTime",
      header: ({ column }) => (
        <div >
          <DataTableColumnHeader column={column} title="Start Date" />
        </div>
      ),
      cell: ({ row }) => <div >{format(row.getValue("startTime"), 'HH:mm:ss - dd/MM/yyyy')}</div>,
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
      accessorKey: "submissionStatus",
      header: ({ column }) => (
        <div className="text-center">
          <DataTableFacetedFilter
            column={column}
            title="Status"
            options={[
              { label: "On Going", value: "ON_GOING" },
              { label: "Complete", value: "COMPLETE" },
            ]}
          />
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("submissionStatus");

        let bgColor = "";
        let textColor = "";
        let Icon = null;

        if (status === "ON_GOING") {
          bgColor = "bg-[#D6E4FF]";
          textColor = "text-[#007BFF]";
          Icon = <Clock size={20} className={textColor} />;
        } else if (status === "COMPLETED") {
          bgColor = "bg-[#CBF2DA]";
          textColor = "text-[#2F4F4F]";
          Icon = <CheckCircle2Icon size={20} className={textColor} />;
        } else if (status === "REVIEWING") {
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-700";
          Icon = <Search size={20} className={textColor} />;
        }
        return (
          <div
            className={`flex items-center justify-center gap-2 p-2 rounded-md w-3/4 ${bgColor} ${textColor}`}
            style={{ margin: "0 auto" }}
          >
            {Icon}
            <span className="capitalize">{(status as string).toLowerCase()}</span>
          </div>
        );
      }
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
