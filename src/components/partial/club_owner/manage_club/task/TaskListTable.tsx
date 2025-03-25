/* eslint-disable @typescript-eslint/no-unused-vars */
import DataTable from "@/components/ui/datatable/data-table";
import { taskColumn } from "./task-table/column";
import { Task } from "@/models/Task";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { taskMemberColumn } from "./task-table/columnTaskMember";

interface TaskData {
  data: Task[];
  setFlag: React.Dispatch<React.SetStateAction<boolean>>;
  isClubOwner: boolean;
  clubId: string;
}
const TaskListTable = ({ data, setFlag, isClubOwner, clubId }: TaskData) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        {isClubOwner && (
          <div className="flex justify-end">
            <Button onClick={() => navigate('/club/create-task', { state: { clubId } })}>Create task</Button>
          </div>
        )}
        {isClubOwner && (
          <DataTable
            columns={taskColumn(isClubOwner, setFlag)}
            data={data}
            searchKey={"taskName"}
            placeholder="Search title"
          />
        )}
        {!isClubOwner && (
          <DataTable
            columns={taskMemberColumn(isClubOwner, setFlag)}
            data={data}
            searchKey={"taskName"}
            placeholder="Search title"
          />
        )}
      </div>
    </>
  );
};

export default TaskListTable;
