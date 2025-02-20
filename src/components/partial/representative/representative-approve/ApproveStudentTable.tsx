/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";

import { contractColumn } from "./approve-table/column";
import StudentRequest from "@/models/StudentRequest";

interface StudentRequestData {
  data: StudentRequest[];
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
}
const ApproveStudentTable = ({ data, setFlag }: StudentRequestData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={contractColumn(setFlag)}
          data={data}
          searchKey={"fullname"}
          placeholder="Search student by name"
        />
      </div>
    </>
  );
};

export default ApproveStudentTable;
