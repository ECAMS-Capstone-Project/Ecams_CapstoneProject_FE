/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row } from "@tanstack/react-table";
import MemberActiveDetailDialog from "../MemberActiveDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DataTableRowActiveActions<TData>({
  row, setFlag
}: DataTableRowActionsProps<TData>) {
  return (
    <>
      <MemberActiveDetailDialog
        initialData={row.original as any}
        setFlag={setFlag}
      />
    </>
  );
}
