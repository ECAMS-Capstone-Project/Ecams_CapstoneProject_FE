/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row } from "@tanstack/react-table";
import { ViewRequestStudentDialog } from "../requestStudentFormDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DataTableRowActions<TData>({
  row, setFlag
}: DataTableRowActionsProps<TData>) {
  return (
    <>
      <ViewRequestStudentDialog
        initialData={row.original as any}
        mode={row.getValue("status") === "CHECKING" ? "pending" : "view"}
        setFlag={setFlag}
      />
    </>
  );
}
