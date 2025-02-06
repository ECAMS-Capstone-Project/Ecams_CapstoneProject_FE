/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, ChevronDown, Eye, XCircleIcon } from "lucide-react";
// import { DataTableRowActions } from "./row-actions";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { getStaff } from "@/models/User";
import { ViewStaffDialog } from "../staffFormDialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Định nghĩa columns cho DataTable
export const StaffColumns: ColumnDef<getStaff>[] = [
  // {
  //   accessorKey: "imageUrl",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Avatar" />
  //   ),
  //   cell: ({ row }) => {
  //     <div className="flex flex-wrap gap-2">
  //       <img
  //         src={row.original.imageUrl}
  //         alt={"Avatar"}
  //         className="w-10 h-10 object-cover"
  //       />
  //     </div>;
  //   }, // Hiển thị Duration kèm đơn vị
  // },
  {
    accessorKey: "fullname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => <span>{row.getValue("fullname")}</span>, // Hiển thị giá trị "Name"
  },
  {
    accessorKey: "phonenumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => <span>{row.getValue("phonenumber")}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },

  {
    accessorKey: "roleName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <span>{row.getValue("roleName")}</span>, // Hiển thị Duration kèm đơn vị
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="flex items-center justify-center">
        <DataTableFacetedFilter
          column={column}
          title="Status"
          options={[
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
          ]}
        />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const [currentStatus, setCurrentStatus] = useState(status);

      const reactivateUni = async () => {
        try {
          // Gửi API để cập nhật trạng thái
          // await reactiveUni(row.original.universityId); // Hàm này là một giả định
          toast.success("Reactivate University Successfully.");
          setCurrentStatus("ACTIVE");
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
                  currentStatus === "ACTIVE"
                    ? "bg-[#CBF2DA] text-[#2F4F4F]"
                    : currentStatus === "INACTIVE"
                    ? "bg-[#FFF5BA] text-[#5A3825]"
                    : ""
                } w-3/4`}
              >
                {currentStatus === "ACTIVE" && (
                  <CheckCircle2Icon size={12} className="text-[#2F4F4F]" />
                )}
                {currentStatus === "INACTIVE" && (
                  <XCircleIcon size={12} className=" text-[#5A3825]" />
                )}

                <span>{currentStatus}</span>
                <ChevronDown size={16} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem
                onClick={() => reactivateUni()}
                className={`${
                  currentStatus === "ACTIVE" ? "bg-[#CBF2DA]" : ""
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
                  currentStatus === "INACTIVE" ? "bg-[#FFF5BA]" : ""
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
    cell: ({ row }) => (
      <>
        <Dialog>
          <DialogTrigger>
            <Eye size={18} />
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <ViewStaffDialog initialData={row.original} />
          </DialogContent>
        </Dialog>
      </>
    ),
  },
];
