/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { clubColumn } from "./club-active-table/column";
import { ClubResponseDTO } from "@/api/club-owner/ClubByUser";

interface ClubData {
  data: ClubResponseDTO[];
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
}
const ClubActiveListTable = ({ data }: ClubData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={clubColumn()}
          data={data}
          searchKey={"taskName"}
          placeholder="Search title"
        />
      </div>
    </>
  );
};

export default ClubActiveListTable;
