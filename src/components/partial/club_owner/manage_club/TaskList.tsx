import TaskListTable from "./task/TaskListTable";

// Dữ liệu giả lập
const tasks = [
    {
        id: "TASK-5160",
        title: "Calculating the bus won't do anything, we need to navigate the back",
        club: "FEV",
        status: "In progress",
        deadline: "2025-01-18",
    },
    {
        id: "TASK-5161",
        title: "Fix UI bug in Member List",
        club: "FEV",
        status: "In progress",
        deadline: "2025-01-18",
    },
    {
        id: "TASK-5162",
        title: "Refactor Event Component",
        club: "FEV",
        status: "Submitted",
        deadline: "2025-01-18",
    },
];

export default function TaskList() {
    return (
        <div className="space-y-2">
            <TaskListTable
                data={tasks} />
            {/* <DataTablePagination
                currentPage={pageNo}
                totalPages={totalPages}
                pageSize={pageSize}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
            /> */}
        </div>
    );
}
