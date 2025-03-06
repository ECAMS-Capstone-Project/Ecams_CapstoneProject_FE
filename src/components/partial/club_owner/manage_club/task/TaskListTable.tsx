/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { taskColumn } from "./task-table/column";
import { Task } from "@/models/Task";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TaskData {
  data: Task[];
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>
}
const TaskListTable = ({ data, setFlag }: TaskData) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="flex justify-end">
          <Button onClick={() => navigate('/club/create-task')}>Creat task</Button>
        </div>
        <DataTable
          columns={taskColumn(setFlag)}
          data={data}
          searchKey={"taskName"}
          placeholder="Search title"
        />
      </div>
    </>
  );
};

export default TaskListTable;
