/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { taskColumn } from "./task-table/column";
import { Task } from "@/models/Task";

interface TaskData {
  data: Task[];
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
}
const TaskListTable = ({ data, setFlag }: TaskData) => {
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          columns={taskColumn(setFlag)}
          data={data}
          searchKey={"title"}
          placeholder="Search title"
        />
      </div>
    </>
  );
};

export default TaskListTable;
