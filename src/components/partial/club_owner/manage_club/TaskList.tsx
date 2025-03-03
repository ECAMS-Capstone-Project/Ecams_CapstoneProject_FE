import { useEffect, useState } from "react";
import TaskListTable from "./task/TaskListTable";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { GetTaskInClubsAPI } from "@/api/club-owner/ClubByUser";
import { Task } from "@/models/Task";

interface props {
    clubId: string
}

export default function TaskList({ clubId }: props) {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [, setIsLoading] = useState(true);
    const loadUniversity = async () => {
        setTotalPages(1);
        try {
            const taskData = await GetTaskInClubsAPI(clubId, pageSize, pageNo);

            if (taskData) {
                setTaskList(taskData.data || []); // Đảm bảo `data.data` tồn tại
                // setTotalPages(taskData.data?.totalPages || 1); // Đặt số trang
            } else {
                console.warn("UniversityList returned no data");
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false); // Hoàn tất tải
        }
    };
    useEffect(() => {
        loadUniversity();
    }, [clubId, pageNo, pageSize]);
    return (
        <div className="space-y-2">
            <TaskListTable
                data={taskList} />
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
