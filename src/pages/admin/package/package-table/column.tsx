/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import type { Package } from "@/models/Package";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { DataTableRowActions } from "./row-actions";
import { useQueryClient } from "@tanstack/react-query";
import { usePackages } from "@/hooks/admin/usePackage";
import { format } from "date-fns";

// Định nghĩa columns cho DataTable
export const packageColumns: ColumnDef<Package>[] = [
  {
    accessorKey: "packageId",
    header: undefined,
    cell: undefined, // Không cần hiển thị
  },
  {
    accessorKey: "packageName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <span>{row.getValue("packageName")}</span>, // Hiển thị giá trị "Name"
  },

  {
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration (Months)" />
    ),
    cell: ({ row }) => <span>{row.getValue("duration")} months</span>, // Hiển thị Duration kèm đơn vị
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <span className="truncate max-w-[150px] block">
        {row.getValue("description")}
      </span>
    ), // Hiển thị Duration kèm đơn vị
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="price" />
    ),
    cell: ({ row }) => (
      <span>{(row.getValue("price") as number).toLocaleString()} VND</span>
    ), // Hiển thị giá theo định dạng USD
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

      // Hàm xử lý thay đổi trạng thái
      const handleStatusChange = async () => {
        const newStatus = !status;
        const queryClient = useQueryClient();
        const { deactivePackage } = usePackages(); // Gọi hook để cập nhật package

        try {
          await deactivePackage(row.original.packageId); // Gọi mutation update package

          // Cập nhật trực tiếp dữ liệu trong bảng mà không cần refetch lại
          queryClient.setQueryData(["packages"], (oldData: any) => {
            return oldData.map((item: Package) =>
              item.packageId === row.original.packageId
                ? { ...item, status: newStatus } // Cập nhật status trong bảng
                : item
            );
          });
        } catch (error) {
          console.error("Error updating package status:", error);
        }
      };

      return (
        <div
          onClick={handleStatusChange} // Bắt sự kiện click
          className={`flex items-center justify-center gap-2 p-2 rounded-md cursor-pointer ${
            status
              ? "bg-[#CBF2DA] text-[#2F4F4F]"
              : "bg-[#FFF5BA] text-[#5A3825]"
          } w-full`} // Đặt width cố định
        >
          {status ? (
            <CheckCircle2Icon size={20} className="h-5 w-5 text-[#2F4F4F]" />
          ) : (
            <XCircleIcon size={20} className="h-5 w-5 text-[#5A3825]" />
          )}
          <span>{status ? "Active" : "Inactive"}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId); // Giá trị boolean thực tế
      return filterValue == String(value);
    },
  },

  {
    accessorKey: "endOfSupportDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End of Support" />
    ),
    cell: ({ row }) => {
      const endOfSupportDate = row.getValue("endOfSupportDate") as Date;
      if (endOfSupportDate) {
        return format(endOfSupportDate, "dd/MM/yyyy");
      } else {
        return "Not yet";
      }
    }, // Hiển thị ngày kết thúc hỗ trợ ở định dạng ngày tháng
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
