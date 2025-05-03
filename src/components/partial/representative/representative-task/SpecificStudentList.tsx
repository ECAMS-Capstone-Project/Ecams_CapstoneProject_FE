/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, ShieldCloseIcon } from "lucide-react";
import { Avatar, Dialog, DialogContent, DialogProps, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AvailableMemberEventTask } from "@/api/student/ClubAgent";

// Props từ code bạn
interface SpecificStudentListProps {
    students: AvailableMemberEventTask[];
    selected: string[];
    handleToggleStudent: (studentId: string, checked: boolean) => void;
    recommendedStudents?: AvailableMemberEventTask[];
    recommendedReasons?: Record<string, string>;
}

const SpecificStudentList: React.FC<SpecificStudentListProps> = ({
    students,
    selected,
    handleToggleStudent,
    recommendedStudents,
    recommendedReasons
}) => {
    const [open, setOpen] = useState(false);
    const [maxWidth] = React.useState<DialogProps['maxWidth']>('md');
    const [selectedStudent, setSelectedStudent] = useState<AvailableMemberEventTask | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const sortedStudents = [...students].sort((a, b) => {
        const aRecommended = recommendedStudents?.some(rs => rs.studentId === a.studentId);
        const bRecommended = recommendedStudents?.some(rs => rs.studentId === b.studentId);

        if (aRecommended && !bRecommended) return -1;
        if (!aRecommended && bRecommended) return 1;
        return 0;
    });

    // Mỗi lần load 5 sinh viên
    const CHUNK_SIZE = 5;
    const [page, setPage] = useState(1);

    // Tham chiếu container
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Khi students thay đổi (tìm kiếm, data mới, …) => reset page về 1
    useEffect(() => {
        setPage(1);
    }, [students]);

    // Dữ liệu hiển thị dựa trên pagination
    const displayed = sortedStudents.slice(0, page * CHUNK_SIZE);

    // Lắng nghe sự kiện scroll
    const handleScroll = () => {
        if (!containerRef.current || isLoadingMore) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

        if (scrollTop + clientHeight >= scrollHeight - 10) {
            if (page * CHUNK_SIZE < sortedStudents.length) {
                setIsLoadingMore(true);

                setTimeout(() => {
                    setPage((prev) => prev + 1);
                    setIsLoadingMore(false);
                }, 2000);
            }
        }
    };

    useEffect(() => {
        const div = containerRef.current;
        if (!div) return;
        div.addEventListener("scroll", handleScroll);
        return () => {
            div.removeEventListener("scroll", handleScroll);
        };
    }, [page, sortedStudents.length]);

    const handleClick = (studentId: string) => {
        // Tìm student trong recommendedStudents nếu có
        const recommended = recommendedStudents?.find(rs => rs.studentId === studentId);
        const baseStudent = students.find(st => st.studentId === studentId);

        if (baseStudent) {
            const mergedStudent: AvailableMemberEventTask = {
                ...baseStudent,
                currentTasks: recommended?.currentTasks || [],
                relatedTasks: recommended?.relatedTasks || []
            };
            setSelectedStudent(mergedStudent);
            setOpen(true);
        }
    };

    return (
        <div
            ref={containerRef}
            className="border p-3 rounded space-y-2 max-h-70 overflow-y-auto"
        >
            {displayed.map((st) => {
                const isChecked = selected.includes(st.studentId);
                const isRecommended = recommendedStudents?.some(rs => rs.studentId === st.studentId);
                return (
                    <div
                        key={st.studentId}
                        className="grid grid-cols-[auto_1fr_auto] items-center w-full rounded-xl border border-muted bg-background px-4 py-3 shadow-sm hover:shadow-md transition gap-3"
                    >
                        <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                                handleToggleStudent(st.studentId, !!checked)
                            }
                        />
                        <div className="flex flex-col">
                            <span className="text-base font-semibold text-foreground">
                                {st.fullName}
                                {isRecommended && (
                                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                        Recommended
                                    </span>
                                )}
                            </span>
                            <span className="text-sm text-muted-foreground">{st.email}</span>
                        </div>
                        <button
                            className="p-2 rounded-md hover:bg-accent transition"
                            title="View detail"
                            type="button"
                            onClick={() => handleClick(st.studentId)}
                        >
                            <Eye className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                );
            })}
            {isLoadingMore && (
                <div className="text-center text-sm text-muted-foreground py-4 animate-pulse">
                    Loading more students...
                </div>
            )}


            <Dialog fullWidth maxWidth={maxWidth} open={open} onClose={() => setOpen(false)}>
                <DialogTitle className="flex justify-between items-center">
                    Detail of student
                    <IconButton onClick={() => setOpen(false)} size="small">
                        <ShieldCloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="space-y-6">

                    {/* 1. Thông tin sinh viên + lý do */}
                    <Card className="shadow-lg border rounded-2xl p-6 bg-[#ebf5f8]">
                        <CardHeader>
                            <div className="flex items-center gap-6 mb-4">
                                <Avatar className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-sm">
                                    {selectedStudent?.fullName.slice(0, 1) || "https://res.cloudinary.com/ecams/image/upload/v1746281259/%E1%BA%A3nh_fpt_xqriyr.png"}
                                </Avatar>
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 p-4 rounded-xl border bg-white shadow">
                                    <div className="space-y-2">
                                        <p className="text-base text-muted-foreground"><b>Full Name:</b> <span className="text-foreground">{selectedStudent?.fullName}</span></p>
                                        <p className="text-base text-muted-foreground flex items-center gap-2">
                                            <b>Email:</b> <span className="text-foreground">{selectedStudent?.email}</span>
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-base text-muted-foreground">
                                            <b>Student ID:</b> <span className="text-foreground">{selectedStudent?.studentId}</span>
                                        </p>
                                        <p className="text-base text-muted-foreground">
                                            <b>Club Activity Point:{" "}</b>
                                            <span className={selectedStudent && selectedStudent.clubActivityPoint > 0
                                                ? "text-green-600 font-semibold"
                                                : "text-red-500 font-semibold"}
                                            >
                                                {selectedStudent && selectedStudent?.clubActivityPoint <= 0 ? (`${selectedStudent?.clubActivityPoint} point`) : (`${selectedStudent?.clubActivityPoint} points`)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {selectedStudent && recommendedReasons?.[selectedStudent.studentId] && (
                                <div className="mt-6">
                                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                                        The reason for being assigned the task
                                    </h3>
                                    <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg px-4 py-3 text-sm text-gray-700 leading-relaxed">
                                        <span className=" text-base text-justify italic">
                                            {recommendedReasons[selectedStudent.studentId]}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </CardHeader>
                    </Card>


                    {/* 2. Current Tasks */}
                    {selectedStudent?.currentTasks && selectedStudent?.currentTasks?.length > 0 ? (
                        <Card className="shadow-lg border mt-6 rounded-2xl">
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-gray-800">Current task</h2>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full overflow-x-auto">
                                    <Table>
                                        <TableHead>
                                            <TableRow className="bg-gray-200 text-gray-800 text-sm">
                                                <TableCell className="font-semibold">Task Name</TableCell>
                                                <TableCell className="font-semibold">Description</TableCell>
                                                <TableCell className="font-semibold text-center">Start Date</TableCell>
                                                <TableCell className="font-semibold text-center">Deadline</TableCell>
                                                <TableCell className="font-semibold text-center">Score</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedStudent.currentTasks.map((task, index) => (
                                                <TableRow
                                                    key={task.eventTaskDetailId}
                                                    className={cn(
                                                        "transition-all text-sm hover:bg-indigo-50",
                                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                    )}
                                                >
                                                    <TableCell className="whitespace-normal break-words max-w-[150px]">{task.detailName}</TableCell>
                                                    <TableCell className="whitespace-normal break-words max-w-[250px]">{task.description}</TableCell>
                                                    <TableCell className="text-center">{new Date(task.startTime).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-center">{task.deadline ? new Date(task.deadline).toLocaleDateString() : "--"}</TableCell>
                                                    <TableCell className="text-center">{task.submissionScore}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    ) : <Card className="py-4">
                        <p className="text-sm text-center text-gray-500 italic">No current tasks</p>
                    </Card>}

                    {/* 3. Related Tasks */}
                    {selectedStudent?.relatedTasks && selectedStudent?.relatedTasks?.length > 0 && (
                        <Card className="shadow-lg border mt-6 rounded-2xl">
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-gray-800">Related task</h2>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full overflow-x-auto">
                                    <Table>
                                        <TableHead>
                                            <TableRow className="bg-gray-200 text-gray-800 text-sm">
                                                <TableCell className="font-semibold">Task Name</TableCell>
                                                <TableCell className="font-semibold">Description</TableCell>
                                                <TableCell className="font-semibold text-center">Deadline</TableCell>
                                                <TableCell className="font-semibold text-center">Submission Date</TableCell>
                                                <TableCell className="font-semibold text-center">Score</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedStudent.relatedTasks.map((task, index) => (
                                                <TableRow
                                                    key={task.eventTaskDetailId}
                                                    className={cn(
                                                        "transition-all text-sm hover:bg-indigo-50",
                                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                    )}
                                                >
                                                    <TableCell className="whitespace-normal break-words max-w-[150px]">{task.detailName}</TableCell>
                                                    <TableCell className="whitespace-normal break-words max-w-[250px]">{task.description}</TableCell>
                                                    <TableCell className="text-center">{task.deadline ? new Date(task.deadline).toLocaleDateString() : "--"}</TableCell>
                                                    <TableCell className="text-center">{task.submissionDate ? new Date(task.submissionDate).toLocaleDateString() : "--"}</TableCell>
                                                    <TableCell className="text-center">{task.submissionScore}</TableCell>

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </DialogContent>
            </Dialog>


            {sortedStudents.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No students found.
                </p>
            )}
        </div>
    );
};

export default SpecificStudentList;
