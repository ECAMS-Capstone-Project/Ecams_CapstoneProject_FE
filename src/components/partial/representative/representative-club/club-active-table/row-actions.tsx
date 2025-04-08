/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row } from "@tanstack/react-table";
import ClubActiveDetailDialog from "./ClubActiveDetailDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DataTableClubRowActions<TData>({
  row, setFlag
}: DataTableRowActionsProps<TData>) {
  return (
    <>
      <ClubActiveDetailDialog
        initialData={row.original as any}
        setFlag={setFlag}
      />
    </>
  );
}
