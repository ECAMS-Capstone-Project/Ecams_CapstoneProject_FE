/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { Noti } from "@/models/Notification";
import { notiColumns } from "./noti-table/column";

interface NotiData {
  data: Noti[];
}
const NotiTable = ({ data }: NotiData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={notiColumns}
          data={data}
          searchKey={"message"}
          placeholder="Search notification's message"
        />
      </div>
    </>
  );
};

export default NotiTable;
