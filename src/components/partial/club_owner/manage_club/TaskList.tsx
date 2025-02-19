import { useEffect, useState } from "react";
import TaskListTable from "./task/TaskListTable";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";

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
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const loadUniversity = async () => {
        setTotalPages(1);
        // try {
        //     const uniData = await UniversityList(pageSize, pageNo);

        //     if (uniData) {
        //         setUniList(uniData.data?.data || []); // Đảm bảo `data.data` tồn tại
        //         setTotalPages(uniData.data?.totalPages || 1); // Đặt số trang
        //     } else {
        //         console.warn("UniversityList returned no data");
        //     }
        // } catch (error) {
        //     console.error("Error loading data:", error);
        // } finally {
        //     setIsLoading(false); // Hoàn tất tải
        // }
    };
    useEffect(() => {
        loadUniversity();
    }, [pageNo, pageSize]);
    return (
        <div className="space-y-2">
            <TaskListTable
                data={tasks} />
            <DataTablePagination
                currentPage={pageNo}
                totalPages={totalPages}
                pageSize={pageSize}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
            />
        </div>
    );
}
