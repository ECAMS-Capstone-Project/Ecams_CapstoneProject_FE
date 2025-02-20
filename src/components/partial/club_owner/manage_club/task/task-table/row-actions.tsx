/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row } from "@tanstack/react-table";
import TaskDetailDialog from "../TaskDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DataTableRowActions<TData>({
  row, setFlag
}: DataTableRowActionsProps<TData>) {
  return (
    <>
      <TaskDetailDialog
        initialData={row.original as any}
        setFlag={setFlag}
      />
    </>
  );
}
