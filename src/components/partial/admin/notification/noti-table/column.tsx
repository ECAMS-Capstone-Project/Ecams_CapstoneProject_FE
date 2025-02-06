/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataTableColumnHeader } from "@/components/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./row-actions";
import { Noti } from "@/models/Notification";

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
export const notiColumns: ColumnDef<Noti>[] = [
  {
    accessorKey: "notificationId",
    header: undefined,
    cell: undefined, // Không cần hiển thị
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
    cell: ({ row }) => <span>SYSTEM</span>,
    //  <span>{row.getValue("notificationType")}</span>, // Hiển thị Duration kèm đơn vị
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
