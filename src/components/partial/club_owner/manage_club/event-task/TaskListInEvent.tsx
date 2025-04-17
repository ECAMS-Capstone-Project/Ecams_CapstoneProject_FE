import { useEffect, useState, useMemo } from "react";
import { GetTaskInClubsAPI, GetTaskMemberInClubsAPI } from "@/api/club-owner/ClubByUser";
import { Task } from "@/models/Task";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Pencil, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input"; // Thêm Input component

interface Props {
    clubId: string;
    isClubOwner: boolean;
}

export default function TaskListInEvent({ clubId, isClubOwner }: Props) {
    const [pageNo, setPageNo] = useState(1);
    const pageSize = 5;
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm.trim().toLowerCase());
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const loadTasks = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const taskData = isClubOwner
                    ? await GetTaskInClubsAPI(clubId, pageSize, pageNo)
                    : await GetTaskMemberInClubsAPI("ae57b2f6-8ec2-4d7d-87e3-4e347c52c2f0", user.userId, pageSize, pageNo);

                setTaskList(taskData?.data?.data.filter(a => a.startTime).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()) || []);
                setTotalPages(taskData?.data?.totalPages || 1);
            } catch (error) {
                console.error("Error loading tasks:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTasks();
    }, [clubId, pageNo, pageSize, isClubOwner, user]);

    const handleNavigate = (taskId: string) => {
        navigate(`/club/task-detail/${taskId}`, { state: { isClubOwner } });
    };

    // 🔎 Filter task theo search term đã debounce
    const filteredTasks = useMemo(() => {
        return taskList.filter((task) =>
            task.taskName.toLowerCase().includes(debouncedSearch)
        );
    }, [taskList, debouncedSearch]);

    return (
        <div className="space-y-6">
            {isClubOwner && (
                <div className="flex justify-between">
                    <div className="w-1/4 md:w-1/4 xs:1/2">
                        <Input
                            placeholder="Search task..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Button
                        onClick={() => navigate("/club/create-task", { state: { clubId } })}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Create Task
                    </Button>
                </div>
            )}

            <div className="grid gap-4">
                {isLoading ? (
                    Array.from({ length: pageSize }).map((_, index) => (
                        <Skeleton key={index} className="h-28 rounded-xl" />
                    ))
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">
                        💤 No tasks found.
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <motion.div
                            key={task.taskId}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card
                                className="rounded-2xl border shadow-sm cursor-pointer hover:shadow-md transition"
                                onClick={() => handleNavigate(task.taskId)}
                            >
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-semibold">{task.taskName}</h3>
                                                {isClubOwner && (
                                                    <Pencil
                                                        size={18}
                                                        className="text-muted-foreground hover:text-primary cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // handleOpenEditDialog(task);
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{task.description}</p>
                                        </div>
                                        <Badge
                                            className={`text-sm px-3 py-1 rounded-full ${task.status ? "bg-green-600" : "bg-yellow-500"}`}
                                        >
                                            {task.status ? "✅ Active" : "⌛ Incomplete"}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                <span className="text-foreground font-medium">Start:</span>{" "}
                                                {format(new Date(task.startTime), "dd/MM/yyyy - hh:mm a")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                <span className="text-foreground font-medium">Deadline:</span>{" "}
                                                {format(new Date(task.deadline), "dd/MM/yyyy - hh:mm a")}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            {!isLoading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <Button
                        variant="outline"
                        disabled={pageNo === 1}
                        onClick={() => setPageNo((prev) => prev - 1)}
                    >
                        Back
                    </Button>
                    <span className="text-sm">
                        Page <strong>{pageNo}</strong> / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={pageNo === totalPages}
                        onClick={() => setPageNo((prev) => prev + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
