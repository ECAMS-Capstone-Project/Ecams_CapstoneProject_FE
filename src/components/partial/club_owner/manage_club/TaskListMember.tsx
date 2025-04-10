import { useEffect, useState } from "react";
import TaskListTable from "./task/TaskListTable";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { Task } from "@/models/Task";
import { GetTaskMemberInClubsAPI } from "@/api/club-owner/ClubByUser";
import useAuth from "@/hooks/useAuth";

interface props {
    clubId: string
    isClubOwner: boolean
}

export default function TaskListMember({ clubId, isClubOwner }: props) {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [, setIsLoading] = useState(true);
    const { user } = useAuth();
    const [flag, setFlag] = useState<boolean>(false);
    useEffect(() => {
        const loadUniversity = async () => {
            if (!user) return;
            setTotalPages(1);
            try {
                const taskData = await GetTaskMemberInClubsAPI(clubId, user.userId, pageSize, pageNo);

                if (taskData) {
                    setTaskList(taskData.data?.data || []);
                    setTotalPages(taskData.data?.totalPages || 1);
                } else {
                    console.warn("Task returned no data");
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUniversity();
    }, [clubId, pageNo, pageSize, user, flag]);
    return (
        <div className="space-y-2">
            <TaskListTable
                clubId={clubId}
                isClubOwner={isClubOwner}
                data={taskList}
                setFlag={setFlag} />
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
