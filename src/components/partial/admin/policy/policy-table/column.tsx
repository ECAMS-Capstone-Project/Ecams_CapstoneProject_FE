/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, ChevronDown, XCircleIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { Policy } from "@/models/Policy";
import { DataTableRowActions } from "./row-actions";

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleString("en-US", options);
};
// Định nghĩa columns cho DataTable
export const PolicyColumns: ColumnDef<Policy>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <span>{row.getValue("title")}</span>, // Hiển thị giá trị "Name"
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => <span>{row.getValue("description")}</span>,
  },

  {
    accessorKey: "effectiveAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Effective Date" />
    ),
    cell: ({ row }) => formatDate(row.getValue("effectiveAt")),
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="flex items-center justify-center">
        <DataTableFacetedFilter
          column={column}
          title="Status"
          options={[
            { label: "Active", value: true },
            { label: "Inactive", value: false },
          ]}
        />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isActive = status == "1";
      const isInactive = status == "0";
      const [currentStatus, setCurrentStatus] = useState(status);

      const reactivateUni = async () => {
        try {
          // Gửi API để cập nhật trạng thái
          // await reactiveUni(row.original.universityId); // Hàm này là một giả định
          toast.success("Reactivate University Successfully.");
          setCurrentStatus("1");
        } catch (error) {
          console.error("Failed to update status:", error);
          toast.error("Failed to update status.");
        }
      };

      return (
        <div className="flex justify-center p-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-md cursor-pointer ${
                  isActive
                    ? "bg-[#CBF2DA] text-[#2F4F4F]"
                    : isInactive
                    ? "bg-[#FFF5BA] text-[#5A3825]"
                    : ""
                } w-3/4`}
              >
                {isActive && (
                  <CheckCircle2Icon size={12} className="text-[#2F4F4F]" />
                )}
                {isInactive && (
                  <XCircleIcon size={12} className=" text-[#5A3825]" />
                )}

                <span>{currentStatus == "1" ? "Active" : "Inactive"}</span>
                <ChevronDown size={16} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem
                onClick={() => reactivateUni()}
                className={`${
                  currentStatus === "1" ? "bg-[#CBF2DA]" : ""
                } cursor-pointer`}
              >
                <CheckCircle2Icon size={18} className=" text-[#2F4F4F]" />{" "}
                Active
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={
                  // (e) => {
                  // e.preventDefault();
                  // setIsDialogOpen(true);
                  () => setCurrentStatus("0")
                }
                className={`${
                  currentStatus === "0" ? "bg-[#FFF5BA]" : ""
                } cursor-pointer`}
              >
                <XCircleIcon size={18} className=" text-[#5A3825]" /> Inactive
              </DropdownMenuItem>
              {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DenyRequest
                  universityId={row.original.universityId}
                  onClose={() => {
                    setIsDialogOpen(false);
                  }}
                  dialogAction={"deactive"}
                  onSuccess={() => setCurrentStatus("INACTIVE")}
                />
              </Dialog> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
