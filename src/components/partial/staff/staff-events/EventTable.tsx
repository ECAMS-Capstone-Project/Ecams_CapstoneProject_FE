/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { Event } from "@/models/Event";
import { EventColums } from "./event-table/column";
import { useState } from "react";

interface EventData {
  data: Event[];
  setStatusFilter: (status: string | null) => void;
  enableFilter: boolean;
}

const EventTable = ({ data, setStatusFilter, enableFilter }: EventData) => {
  const [selectedStatus, setSelectedStatus] = useState("Select status");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // const columns = EventColums(setStatusFilter, selectedStatus, setSelectedStatus, statusDropdownOpen, setStatusDropdownOpen);

  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={EventColums(
            setStatusFilter,
            selectedStatus,
            setSelectedStatus,
            statusDropdownOpen,
            setStatusDropdownOpen,
            enableFilter
          )}
          data={data}
          searchKey={"eventName"}
          placeholder="Search event's name"
        />
      </div>
    </>
  );
};

export default EventTable;
