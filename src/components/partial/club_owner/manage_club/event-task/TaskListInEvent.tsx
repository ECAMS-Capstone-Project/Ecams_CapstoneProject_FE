import { useEffect, useState, useMemo } from "react";
import { GetTaskInClubsAPI, GetTaskMemberInClubsAPI } from "@/api/club-owner/ClubByUser";
import { Task } from "@/models/Task";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, Clock, PlusCircle, Users } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { InterTask } from "@/models/InterTask";
import { cn } from "@/lib/utils";
import EventTaskBreadcrumb from "./EventTaskBreadcrumb";

export default function TaskListInEvent() {
    const { eventId = "" } = useParams();
    const location = useLocation();
    const isClubOwner = location.state?.isClubOwner as boolean
    const task = location.state?.task as InterTask
    const [pageNo, setPageNo] = useState(1);
    const pageSize = 5;
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const getStatusColor = (status: string, percentage: number) => {
        if (status === "COMPLETED" || percentage === 100)
            return "bg-green-100 text-green-800";
        if (percentage > 0 || status === "ON_GOING")
            return "bg-yellow-100 text-yellow-800";
        return "bg-blue-100 text-blue-800";
    };

    const getStatusText = (status: string, percentage: number) => {
        if (status === "COMPLETED" || percentage === 100) return "Completed";
        if (percentage > 0 || status === "ON_GOING")
            return `ON_GOING (${percentage}%)`;
        return "Overdue";
    };

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
                    ? await GetTaskInClubsAPI("fad28837-8bd0-46a3-bd80-205a1a7ba97d", pageSize, pageNo)
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
    }, [eventId, pageNo, pageSize, isClubOwner, user]);

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
            <EventTaskBreadcrumb
                items={[
                    { label: "Event List" },
                    { label: "Task list in event", href: `/club/event-task/${eventId}` },
                    { label: "Sub task list in event" },
                ]}
            />
            <div>
                <Card className="p-6 rounded-lg bg-blue-50">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-[#136cb9]" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-blue-600">{task?.taskName}</h1>
                                </div>
                            </div>
                            <p className="text-muted-foreground mt-2">{task.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2 text-[#136CB9]">
                                    <Clock className="h-4 w-4" />
                                    Start Time
                                </h4>
                                <div className="flex items-center gap-2 text-muted-foreground bg-white p-2 rounded-md border border-[#136CB9]/20">
                                    <Calendar className="h-4 w-4 text-[#136CB9]" />
                                    <span>
                                        {format(new Date(task.startTime), "dd/MM/yyyy HH:mm")}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2 text-[#136CB9]">
                                    <AlertCircle className="h-4 w-4" />
                                    Deadline
                                </h4>
                                <div className="flex items-center gap-2 text-muted-foreground bg-white p-2 rounded-md border border-[#136CB9]/20">
                                    <Calendar className="h-4 w-4 text-[#136CB9]" />
                                    <span>
                                        {format(new Date(task.deadline), "dd/MM/yyyy HH:mm")}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium mb-1 flex items-center gap-2 text-[#136CB9]">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Status
                                </h4>
                                <span
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-sm font-medium",
                                        getStatusColor(task.status, task.completionPercentage)
                                    )}
                                >
                                    {getStatusText(task.status, task.completionPercentage)}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2 text-[#136CB9]">
                                    <Users className="h-4 w-4" />
                                    Assign to
                                </h4>
                                <span>{task.clubName}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <Card className="bg-gray-50">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-blue-500 flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        Submission
                    </h2>

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
                                onClick={() => navigate("/club/create-task", { state: { clubId: eventId } })}
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
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{task.description}</p>
                                                </div>
                                                <Badge
                                                    className={`text-sm px-3 py-1 rounded-full ${task.status ? "bg-green-600" : "bg-yellow-500"}`}
                                                >
                                                    {task.status ? "Active" : "Incomplete"}
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
                </CardContent>
            </Card>
        </div>
    );
}
