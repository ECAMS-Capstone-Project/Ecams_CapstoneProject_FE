import React, { useEffect, useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";

// Kiểu Student
interface Student {
    studentId: string;
    fullName: string;
    roleName: string;
}

// Props từ code bạn
interface SpecificStudentListProps {
    students: Student[];          // Danh sách đã filter theo searchTerm
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
    // Lọc bỏ các student có roleName là "CLUB_OWNER"
    const filteredStudents = students.filter(
        (st) => st.roleName.toUpperCase() !== "CLUB_OWNER"
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

    return (
        <div
            ref={containerRef}
            className="border p-3 rounded space-y-2 max-h-36 overflow-y-auto"
        >
            {displayed.map((st) => {
                const isChecked = selected.includes(st.studentId);
                return (
                    <div key={st.studentId} className="flex items-center space-x-2">
                        <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                                handleToggleStudent(st.studentId, !!checked)
                            }
                            disabled={isAssignAll}
                        />
                        <label className="text-sm text-foreground">
                            {st.fullName} - {st.roleName}
                        </label>
                    </div>
                );
            })}

            {filteredStudents.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No students found.
                </p>
            )}
        </div>
    );
};

export default SpecificStudentList;
