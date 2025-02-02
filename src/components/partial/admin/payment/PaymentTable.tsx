/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { Transaction } from "@/models/Payment";
import { paymentColumns } from "./payment-table/column";

interface PaymentData {
  data: Transaction[];
}
const PaymentTable = ({ data }: PaymentData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={paymentColumns}
          data={data}
          searchKey={"packageName"}
          placeholder="Search transaction"
        />
      </div>
    </>
  );
};

export default PaymentTable;
