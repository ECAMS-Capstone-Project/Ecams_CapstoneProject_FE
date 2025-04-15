import { useEffect, useState } from "react";
import { GetTaskInClubsAPI } from "@/api/club-owner/ClubByUser";
import { Task } from "@/models/Task";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface props {
    clubId: string
    isClubOwner: boolean
}

export default function TaskListInEvent({ clubId }: props) {
    const [pageNo] = useState(1);
    const [pageSize] = useState(5);
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [, setIsLoading] = useState(true);
    const [flag] = useState<boolean>(false);
    useEffect(() => {
        const loadUniversity = async () => {
            try {
                const taskData = await GetTaskInClubsAPI(clubId, pageSize, pageNo);

                if (taskData) {
                    setTaskList(taskData.data?.data || []);
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
    }, [clubId, pageNo, pageSize, flag]);
    const navigate = useNavigate();
    return (
        <div className="grid gap-4">
            {taskList?.map((task) => (
                <Card key={task.taskId} className="rounded-2xl border shadow-md hover:shadow-lg transition duration-300" onClick={() => navigate('/club/task-detail')}>
                    <CardContent className="p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">{task.taskName}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            </div>
                            <Badge variant={'default'} className="text-sm px-3 bg-green-600  py-1 rounded-full">
                                {task.status ? "✅ Active" : "⌛ Chưa hoàn thành"}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span><span className="text-foreground font-medium">Bắt đầu:</span> {task.startTime}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span><span className="text-foreground font-medium">Deadline:</span> {task.deadline}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                <span><span className="text-foreground font-medium">Nộp bài:</span> {task.submissionStatus}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-foreground font-medium">Điểm:</span>
                                <span className="font-semibold">{task.taskScore}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
