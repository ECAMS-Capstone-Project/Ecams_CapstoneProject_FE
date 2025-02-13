/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { getStaff } from "@/models/User";
import { StaffColumns } from "./staff-table/column";

interface StaffData {
  data: getStaff[];
}
const StaffTable = ({ data }: StaffData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={StaffColumns}
          data={data}
          searchKey={"fullname"}
          placeholder="Search staff's name..."
        />
      </div>
    </>
  );
};

export default StaffTable;
