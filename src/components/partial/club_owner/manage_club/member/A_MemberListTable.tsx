/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { ClubMemberDTO } from "@/api/club-owner/ClubByUser";
import { memberActiveColumn } from "./member-table/columnActive";

interface MemberData {
  data: ClubMemberDTO[];
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
  isClubOwner: boolean
}
const ActiveMemberListTable = ({ data, setFlag, isClubOwner }: MemberData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={memberActiveColumn(isClubOwner, setFlag)}
          data={data}
          searchKey={"fullname"}
          placeholder="Search student by name"
        />
      </div>
    </>
  );
};

export default ActiveMemberListTable;
