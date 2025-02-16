import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";

// Dữ liệu giả lập
const members = [
    {
        id: 1,
        fullName: "Lưu Việt Nam",
        email: "babykachuma@gmail.com",
        dob: "2003-07-22",
        gender: "Male",
        role: "Member",
    },
    {
        id: 2,
        fullName: "Lưu Hoàng Nam",
        email: "babykachuma@gmail.com",
        dob: "2003-07-22",
        gender: "Male",
        role: "Member",
    },
    {
        id: 3,
        fullName: "Lưu Văn Mạnh",
        email: "babykachuma@gmail.com",
        dob: "2003-07-22",
        gender: "Male",
        role: "Member",
    },
    {
        id: 4,
        fullName: "Lành Thị Cúc",
        email: "babykachuma@gmail.com",
        dob: "2003-07-22",
        gender: "Female",
        role: "Member",
    },
    {
        id: 5,
        fullName: "Phùng Thị Hoa",
        email: "babykachuma@gmail.com",
        dob: "2003-07-22",
        gender: "Female",
        role: "Club Owner",
    },
];

export default function MemberList() {
    return (
        <div className="space-y-2">
            {/* Bảng Member List */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Member ID</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell>{member.id}</TableCell>
                            <TableCell>{member.fullName}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{member.dob}</TableCell>
                            <TableCell>{member.gender}</TableCell>
                            <TableCell>
                                {member.role === "Club Owner" ? (
                                    <Badge variant="outline" className="border-blue-600 text-blue-600">
                                        Club Owner
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="border-green-600 text-green-600">
                                        Member
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon">
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Thanh phân trang (Pagination) */}
            <div className="flex items-center justify-end gap-4">
                {/* Rows per page */}
                <div className="flex items-center gap-2 text-sm">
                    <span>Rows per page</span>
                    <select className="border rounded px-2 py-1 text-sm">
                        <option value="5">5</option>
                        <option value="10" defaultValue={"10"}>
                            10
                        </option>
                        <option value="25">25</option>
                    </select>
                </div>

                {/* Page info */}
                <span className="text-sm">Page 1 of 10</span>

                {/* Buttons chuyển trang */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
