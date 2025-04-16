import { useEffect, useState } from "react";
import { GetTaskInClubsAPI } from "@/api/club-owner/ClubByUser";
import { Task } from "@/models/Task";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Pencil, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface Props {
    clubId: string;
    isClubOwner: boolean;
}

export default function TaskListInEvent({ clubId, isClubOwner }: Props) {
    const [pageNo] = useState(1);
    const [pageSize] = useState(5);
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [, setIsLoading] = useState(true);
    const [flag] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const taskData = await GetTaskInClubsAPI(clubId, pageSize, pageNo);
                if (taskData) {
                    setTaskList(taskData.data?.data || []);
                }
            } catch (error) {
                console.error("Error loading tasks:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTasks();
    }, [clubId, pageNo, pageSize, flag]);

    const handleNavigate = (taskId: string) => {
        navigate(`/club/task-detail/${taskId}`, { state: { isClubOwner: isClubOwner } })
    }

    return (
        <div className="space-y-6">
            {isClubOwner && (
                <div className="flex justify-end">
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
                {taskList?.map((task) => (
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
                                            <Pencil
                                                size={18}
                                                className="text-muted-foreground hover:text-primary cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // handleOpenEditDialog(task);
                                                }}
                                            />
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
                ))}
            </div>
        </div>
    );
}
