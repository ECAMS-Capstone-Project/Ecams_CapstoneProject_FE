/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row } from "@tanstack/react-table";
import TaskDetailDialog from "../TaskDialog";
import TaskDialogClubOwner from "../TaskDialogClubOwner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setFlag: React.Dispatch<React.SetStateAction<boolean>>;
  isClubOwner: boolean
}

export function DataTableRowActions<TData>({
  row, setFlag, isClubOwner
}: DataTableRowActionsProps<TData>) {
  return (
    <>
      {!isClubOwner ? (
        <TaskDetailDialog
          initialData={row.original as any}
          setFlag={setFlag}
        />
      ) : (
        <TaskDialogClubOwner initialData={row.original as any}
          setFlag={setFlag} />
      )}
    </>
  );
}
