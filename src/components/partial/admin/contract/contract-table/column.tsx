/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/ui/datatable/data-table-faceted-filter";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, EyeIcon, XCircleIcon } from "lucide-react";
import { Contract } from "@/models/Contract";
import { useNavigate } from "react-router-dom";
import { format, isValid } from "date-fns";

// Định nghĩa columns cho DataTable
export const contractColumn: ColumnDef<Contract>[] = [
  {
    accessorKey: "contractId",
    header: undefined,
    cell: undefined, // Không cần hiển thị
  },
  {
    accessorKey: "representativeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Representative" />
    ),
    cell: ({ row }) => <span>{row.getValue("representativeName")}</span>, // Hiển thị giá trị "Name"
  },

  {
    accessorKey: "packageName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Package" />
    ),
    cell: ({ row }) => <span>{row.getValue("packageName")}</span>, // Hiển thị Duration kèm đơn vị
  },
  {
    accessorKey: "universityName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="University" />
    ),
    cell: ({ row }) => <span>{row.getValue("universityName")}</span>, // Hiển thị Duration kèm đơn vị
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableFacetedFilter
        column={column}
        title="Status"
        options={[
          { label: "Active", value: true },
          { label: "Inactive", value: false },
        ]}
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isActive = status == "1";
      const isInactive = status == "0";

      return (
        <div
          className={`flex items-center justify-center gap-2 p-2 rounded-md ${isActive
            ? "bg-[#CBF2DA] text-[#2F4F4F]"
            : isInactive
              ? "bg-[#FFF5BA] text-[#5A3825]"
              : ""
            } w-full`} // Đặt width cố định
        >
          {isActive && (
            <CheckCircle2Icon size={20} className="h-5 w-5 text-[#2F4F4F]" />
          )}
          {isInactive && (
            <XCircleIcon size={20} className="h-5 w-5 text-[#5A3825]" />
          )}
          <span>{status == "1" ? "Active" : "Inactive"}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId); // Giá trị boolean thực tế
      return filterValue == String(value);
    },
  },

  {
    accessorKey: "signedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Signed Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("signedDate"));
      return isValid(date) ? format(date, "dd/MM/yyyy") : "Date not valid";
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Started Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      return isValid(date) ? format(date, "dd/MM/yyyy") : "Date not valid";
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ended Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"));
      return isValid(date) ? format(date, "dd/MM/yyyy") : "Date not valid";
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <div className="flex justify-center mr-3">
          <EyeIcon
            size={24}
            className="text-center cursor-pointer"
            onClick={() =>
              navigate(`/admin/contract/${row.original.contractId}`)
            }
          />
        </div>
      );
    },
  },
];
