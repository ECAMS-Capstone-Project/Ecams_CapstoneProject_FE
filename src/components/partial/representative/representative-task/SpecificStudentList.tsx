import React, { useEffect, useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, ShieldCloseIcon } from "lucide-react";
import { Dialog, DialogContent, DialogProps, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AvailableMemberEventTask } from "@/api/student/ClubAgent";

// Props từ code bạn
interface SpecificStudentListProps {
    students: AvailableMemberEventTask[];          // Danh sách đã filter theo searchTerm
    selected: string[];           // Mảng studentId đã chọn
    isAssignAll: boolean;         // Nếu true => disable checkbox
    handleToggleStudent: (studentId: string, checked: boolean) => void;
}

const SpecificStudentList: React.FC<SpecificStudentListProps> = ({
    students,
    selected,
    isAssignAll,
    handleToggleStudent,
}) => {
    const [open, setOpen] = useState(false);
    const [maxWidth] = React.useState<DialogProps['maxWidth']>('lg');
    const [selectedStudent, setSelectedStudent] = useState<AvailableMemberEventTask | null>(null);

    // Lọc bỏ các student có roleName là "CLUB_OWNER"
    const filteredStudents = students.filter(
        (st) => st.clubActivityPoint >= 0
    );

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
    const displayed = filteredStudents.slice(0, page * CHUNK_SIZE);

    // Lắng nghe sự kiện scroll
    const handleScroll = () => {
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

        // Nếu cuộn gần chạm đáy (cách đáy 10px)
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            if (page * CHUNK_SIZE < filteredStudents.length) {
                setPage((prev) => prev + 1);
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
    }, [page, filteredStudents.length]);

    const demoTasks = [
        {
            taskId: "1",
            taskName: "Nhiệm vụ hiện tại",
            description: "Thuyết trình về dự án CLB",
            startTime: "2025-04-01",
            deadline: "2025-04-15",
            status: false,
            taskScore: "--",
            submissionStatus: "Chưa nộp",
            clubMemberId: "ST12345",
        },
        {
            taskId: "2",
            taskName: "Viết báo cáo cuối kỳ",
            description: "Tổng hợp hoạt động quý 1",
            startTime: "2025-01-01",
            deadline: "2025-01-20",
            status: true,
            taskScore: "9.5",
            submissionStatus: "Đã nộp",
            clubMemberId: "ST12345",
        },
        {
            taskId: "3",
            taskName: "Thiết kế poster",
            description: "Poster cho sự kiện Xuân Tình Nguyện",
            startTime: "2024-12-01",
            deadline: "2024-12-15",
            status: true,
            taskScore: "8.7",
            submissionStatus: "Đã nộp",
            clubMemberId: "ST12345",
        },
    ];

    const currentTaskId = "1";

    const handleClick = (student: AvailableMemberEventTask) => {
        setSelectedStudent(student);
        setOpen(true);
    };

    return (
        <div
            ref={containerRef}
            className="border p-3 rounded space-y-2 max-h-36 overflow-y-auto"
        >
            {displayed.map((st) => {
                const isChecked = selected.includes(st.studentId);
                return (
                    <div key={st.studentId} className="flex items-center w-96 justify-between rounded-lg p-2 border border-muted mb-2 hover:bg-muted/50 transition">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) =>
                                    handleToggleStudent(st.studentId, !!checked)
                                }
                                disabled={isAssignAll}
                            />
                            <span className="text-sm font-medium text-foreground">
                                {st.fullName} - <span className="text-muted-foreground">{st.email}</span>
                            </span>
                            <button
                                className="p-1 rounded hover:bg-accent transition"
                                title="Xem chi tiết"
                                type="button"
                                onClick={() => handleClick(st)}
                            >
                                <Eye className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                );
            })}

            <Dialog fullWidth maxWidth={maxWidth} open={open} onClose={() => setOpen(false)} >
                <DialogTitle className="flex justify-between items-center">
                    Chi tiết học sinh
                    <IconButton onClick={() => setOpen(false)} size="small">
                        <ShieldCloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="space-y-6">
                    {/* Thông tin học sinh */}
                    {/* Thông tin học sinh */}
                    <Card className="shadow-lg border rounded-2xl p-2">
                        <CardHeader>
                            <div className="flex items-center gap-6">
                                <img
                                    src="https://github.com/shadcn.png"
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-md"
                                />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedStudent?.fullName}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{selectedStudent?.email}</p>
                                    <p className="text-sm text-gray-500">ID: {selectedStudent?.studentId}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">Lý do được giao nhiệm vụ:</h3>
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                    <li>Thành viên năng nổ và có tinh thần trách nhiệm cao.</li>
                                    <li>Hoàn thành tốt các nhiệm vụ trước như viết báo cáo và thiết kế poster.</li>
                                    <li>Có khả năng giao tiếp và thuyết trình tốt.</li>
                                    <li>Kỹ năng thiết kế và trình bày nội dung rõ ràng.</li>
                                    <li>Thái độ làm việc nhóm tích cực, phối hợp hiệu quả với các bạn khác.</li>
                                </ul>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Danh sách nhiệm vụ */}
                    <Card className="shadow-lg border mt-6 rounded-2xl">
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-gray-800">Danh sách nhiệm vụ</h2>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full overflow-x-auto">
                                <Table>
                                    <TableHead>
                                        <TableRow className="bg-gray-200 text-gray-800 text-sm">
                                            <TableCell className="font-semibold">Tên task</TableCell>
                                            <TableCell className="font-semibold">Miêu tả</TableCell>
                                            <TableCell className="font-semibold">Bắt đầu</TableCell>
                                            <TableCell className="font-semibold">Deadline</TableCell>
                                            <TableCell className="font-semibold">Điểm</TableCell>
                                            <TableCell className="font-semibold">Nộp bài</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {demoTasks.map((task, index) => (
                                            <TableRow
                                                key={task.taskId}
                                                className={cn(
                                                    "transition-all text-sm hover:bg-indigo-50 cursor-pointer",
                                                    task.taskId === currentTaskId
                                                        ? "bg-indigo-100"
                                                        : index % 2 === 0
                                                            ? "bg-white"
                                                            : "bg-gray-50"
                                                )}
                                            >
                                                <TableCell className="whitespace-normal break-words max-w-[150px]">{task.taskName}</TableCell>
                                                <TableCell className="whitespace-normal break-words max-w-[250px]">{task.description}</TableCell>
                                                <TableCell>{task.startTime}</TableCell>
                                                <TableCell>{task.deadline}</TableCell>
                                                <TableCell>{task.taskScore ?? "--"}</TableCell>
                                                <TableCell className="whitespace-normal break-words max-w-[100px]">
                                                    {task.submissionStatus}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                </DialogContent>
            </Dialog>

            {filteredStudents.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No students found.
                </p>
            )}
        </div>
    );
};

export default SpecificStudentList;
