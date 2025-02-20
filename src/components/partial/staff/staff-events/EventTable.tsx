/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { Event } from "@/models/Event";
import { EventColums } from "./event-table/column";

interface EventData {
  data: Event[];
}
const EventTable = ({ data }: EventData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={EventColums}
          data={data}
          searchKey={"name"}
          placeholder="Search area's name"
        />
      </div>
    </>
  );
};

export default EventTable;
