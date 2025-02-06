/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { Policy } from "@/models/Policy";
import { PolicyColumns } from "./policy-table/column";

interface PolicyData {
  data: Policy[];
}
const PolicyTable = ({ data }: PolicyData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={PolicyColumns}
          data={data}
          searchKey={"title"}
          placeholder="Search policy's title..."
        />
      </div>
    </>
  );
};

export default PolicyTable;
