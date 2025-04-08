/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./row-actions";
import { Area } from "@/models/Area";

import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAreas } from "@/hooks/staff/Area/useArea";

// Định nghĩa columns cho DataTable
export const AreaColums: ColumnDef<Area>[] = [
  { accessorKey: "areaId", header: undefined, cell: undefined },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "imageUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-2 justify-start">
          <img
            src={row.original.imageUrl}
            alt={"Product Image"}
            className="w-12 h-12 object-cover"
          />
        </div>
      );
    }, // Không cần hiển thị
  },

  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <span className="truncate max-w-[200px] block ">
        {row.getValue("description")}
      </span>
    ),
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacity" />
    ),
    cell: ({ row }) => <span>{row.getValue("capacity")} people</span>,
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
      const status = row.getValue("status") as boolean;

      // Hàm xử lý thay đổi trạng thái
      const handleStatusChange = async () => {
        const newStatus = !status; // Đổi trạng thái khi nhấn
        const queryClient = useQueryClient();
        // Gọi mutation để update dữ liệu trên server
        const { updateArea } = useAreas();
        await updateArea;

        // Cập nhật trực tiếp dữ liệu trong bảng mà không cần refetch lại
        queryClient.setQueryData(["areas"], (oldData: any) => {
          return oldData.map((item: Area) =>
            item.areaId === row.original.areaId
              ? { ...item, status: newStatus }
              : item
          );
        });
      };

      return (
        <div className="flex justify-center p-0">
          <div
            onClick={handleStatusChange} // Bắt sự kiện click
            className={`flex items-center justify-center gap-1 py-2 px-2 rounded-md cursor-pointer ${
              status
                ? "bg-[#CBF2DA] text-[#2F4F4F]"
                : "bg-[#FFF5BA] text-[#5A3825]"
            } w-auto`}
          >
            {status ? (
              <CheckCircle2Icon size={12} className="text-[#2F4F4F]" />
            ) : (
              <XCircleIcon size={12} className=" text-[#5A3825]" />
            )}
            <span>{status ? "Active" : "Inactive"}</span>
          </div>
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
