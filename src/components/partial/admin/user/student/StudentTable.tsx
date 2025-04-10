/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { Student } from "@/models/User";
import { StudentColumns } from "./student-table/column";

interface StudentData {
  data: Student[];
}
const StudentTable = ({ data }: StudentData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={StudentColumns}
          data={data}
          searchKey={"fullname"}
          placeholder="Search student's name"
        />
      </div>
    </>
  );
};

export default StudentTable;
