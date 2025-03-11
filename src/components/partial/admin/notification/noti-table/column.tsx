import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./row-actions";
import { Noti } from "@/models/Notification";

// Định nghĩa columns cho DataTable
export const notiColumns: ColumnDef<Noti>[] = [
  {
    accessorKey: "notificationId",
    enableColumnFilter: false, // Tắt lọc cột này
    enableSorting: false, // Tắt sắp xếp cột này
    enableHiding: true,
    header: undefined,
    cell: undefined,
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
    cell: ({ row }) => (
      <span className="truncate max-w-lg block px-5">
        {row.getValue("message")}
      </span>
    ), // Hiển thị giá trị "Name"
  },

  {
    accessorKey: "notificationType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notification Type" />
    ),
    cell: () => <span>SYSTEM</span>,
    //  <span>{row.getValue("notificationType")}</span>, // Hiển thị Duration kèm đơn vị
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
