/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";

import { Contract } from "@/models/Contract";
import { contractColumn } from "./contract-table/column";

interface ContractData {
  data: Contract[];
}
const ContractTable = ({ data }: ContractData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={contractColumn}
          data={data}
          searchKey={"universityName"}
          placeholder="Search contract's university"
        />
      </div>
    </>
  );
};

export default ContractTable;
