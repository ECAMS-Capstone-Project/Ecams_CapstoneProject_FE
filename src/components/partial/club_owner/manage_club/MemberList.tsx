import { User } from "@/models/User";
import MemberListTable from "./member/MemberListTable";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { useEffect, useState } from "react";

const fakeUsers: User[] = [
    {
        userId: "1",
        email: "johndoe@example.com",
        fullname: "John Doe",
        address: "123 Main Street, Cityville",
        phonenumber: "+1234567890",
        gender: "Male",
        avatar: "https://www.example.com/avatar1.jpg",
        passwordHash: new Uint8Array([10, 20, 30, 40, 50]),
        passwordSalt: new Uint8Array([5, 10, 15, 20, 25]),
        status: "Active",
        isVerified: true,
    },
    {
        userId: "2",
        email: "janedoe@example.com",
        fullname: "Jane Doe",
        address: "456 Elm Street, Townsville",
        phonenumber: "+0987654321",
        gender: "Female",
        avatar: "https://www.example.com/avatar2.jpg",
        passwordHash: new Uint8Array([60, 70, 80, 90, 100]),
        passwordSalt: new Uint8Array([55, 65, 75, 85, 95]),
        status: "Inactive",
        isVerified: false,
    },
    {
        userId: "3",
        email: "bobs@example.com",
        fullname: "Bob Smith",
        address: "789 Oak Street, Villageburg",
        phonenumber: "+1122334455",
        gender: "Male",
        avatar: "https://www.example.com/avatar3.jpg",
        passwordHash: new Uint8Array([110, 120, 130, 140, 150]),
        passwordSalt: new Uint8Array([105, 115, 125, 135, 145]),
        status: "Active",
        isVerified: true,
    },
    {
        userId: "4",
        email: "alice@example.com",
        fullname: "Alice Brown",
        address: "101 Pine Street, Metrocity",
        phonenumber: "+2233445566",
        gender: "Female",
        avatar: "https://www.example.com/avatar4.jpg",
        passwordHash: new Uint8Array([160, 170, 180, 190, 200]),
        passwordSalt: new Uint8Array([155, 165, 175, 185, 195]),
        status: "Pending",
        isVerified: false,
    },
    {
        userId: "5",
        email: "carol@example.com",
        fullname: "Carol White",
        address: "202 Birch Street, Seaside",
        phonenumber: "+3344556677",
        gender: "Female",
        avatar: "https://www.example.com/avatar5.jpg",
        passwordHash: new Uint8Array([210, 220, 230, 240, 250]),
        passwordSalt: new Uint8Array([205, 215, 225, 235, 245]),
        status: "Active",
        isVerified: true,
    },
];

export default function MemberList() {
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const loadUniversity = async () => {
        setTotalPages(1);
        // try {
        //     const uniData = await UniversityList(pageSize, pageNo);

        //     if (uniData) {
        //         setUniList(uniData.data?.data || []); // Đảm bảo `data.data` tồn tại
        //         setTotalPages(uniData.data?.totalPages || 1); // Đặt số trang
        //     } else {
        //         console.warn("UniversityList returned no data");
        //     }
        // } catch (error) {
        //     console.error("Error loading data:", error);
        // } finally {
        //     setIsLoading(false); // Hoàn tất tải
        // }
    };
    useEffect(() => {
        loadUniversity();
    }, [pageNo, pageSize]);
    return (
        <div className="space-y-2">
            <MemberListTable data={fakeUsers} />
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
