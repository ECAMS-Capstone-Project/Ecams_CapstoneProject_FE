/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row } from "@tanstack/react-table";
import MemberDetailDialog from "../MemberDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
  clubId: string
}

export function DataTableRowActions<TData>({
  row, setFlag, clubId
}: DataTableRowActionsProps<TData>) {
  return (
    <>
      <MemberDetailDialog
        initialData={row.original as any}
        setFlag={setFlag}
        clubId={clubId}
      />
    </>
  );
}
