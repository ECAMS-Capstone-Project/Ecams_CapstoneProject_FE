/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { University } from "@/models/University";
import { UniColumns } from "./university-table/column";

interface UniversityData {
  data: University[];
  refreshData: any;
}
const UniversityTable = ({ data, refreshData }: UniversityData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={UniColumns(refreshData)}
          data={data}
          searchKey={"universityName"}
          placeholder="Search university's name"
        />
      </div>
    </>
  );
};

export default UniversityTable;
