/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { memberColumn } from "./member-table/column";
import { ClubMemberDTO } from "@/api/club-owner/ClubByUser";

interface MemberData {
  data: ClubMemberDTO[];
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
}
const MemberListTable = ({ data, setFlag }: MemberData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={memberColumn(setFlag)}
          data={data}
          searchKey={"fullname"}
          placeholder="Search student by name"
        />
      </div>
    </>
  );
};

export default MemberListTable;
