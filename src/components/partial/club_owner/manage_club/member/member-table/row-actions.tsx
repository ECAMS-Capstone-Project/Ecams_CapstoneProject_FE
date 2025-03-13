/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row } from "@tanstack/react-table";
import MemberDetailDialog from "../MemberDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DataTableRowActions<TData>({
  row, setFlag
}: DataTableRowActionsProps<TData>) {
  return (
    <>
      <MemberDetailDialog
        initialData={row.original as any}
        setFlag={setFlag}
        mode={row.getValue("status") !== "CHECKING" ? "pending" : "view"}
      />
    </>
  );
}
