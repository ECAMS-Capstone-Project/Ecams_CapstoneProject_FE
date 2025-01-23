/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { Package } from "@/models/Package";
import { packageColumns } from "@/pages/admin/package/package-table/column";

interface PackageData {
  data: Package[];
}
const PackageTable = ({ data }: PackageData) => {
  console.log("table data", data);

  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable columns={packageColumns} data={data} />
      </div>
    </>
  );
};

export default PackageTable;
