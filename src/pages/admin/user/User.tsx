import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { getStaff, Student } from "@/models/User";
import { getStudentList, StaffList } from "@/api/agent/UserAgent";
import StaffTable from "@/components/partial/admin/user/staff/StaffTable";

const StudentTable = React.lazy(
  () => import("@/components/partial/admin/user/student/StudentTable")
);

const User = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [staffList, setStaffList] = useState<getStaff[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  // const [activeTab, setActiveTab] = useState("");
  useEffect(() => {
    const loadUser = async () => {
      try {
        const staffData = await StaffList("STAFF", pageSize, pageNo);
        const student = await getStudentList();
        if (staffData) {
          setStaffList(staffData.data?.data || []); // Đảm bảo `data.data` tồn tại
          setTotalPages(staffData.data?.totalPages || 1); // Đặt số trang
        } else {
          console.warn("UniversityList returned no data");
        }
        if (student) {
          setStudentList(student); // Đảm bảo `data.data` tồn tại
        } else {
          console.warn("UniversityList returned no data");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false); // Hoàn tất tải
      }
    };

    loadUser();
  }, [pageNo, pageSize]);

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {/* Hiển thị spinner nếu API chưa tải xong */}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex items-center justify-between pt-4">
            <Heading
              title={`Manage User`}
              description="Manage User in the system"
            />
          </div>
          <Separator />
          <Tabs
            defaultValue="student"
            // value={activeTab}
            // onValueChange={setActiveTab}
            className="w-full mt-3 p-2"
          >
            <TabsList>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="student">Student</TabsTrigger>
            </TabsList>

            <TabsContent value="staff">
              <StaffTable data={staffList} />
            </TabsContent>
            <TabsContent value="student">
              <StudentTable data={studentList} />

              <DataTablePagination
                currentPage={pageNo}
                totalPages={totalPages}
                pageSize={pageSize}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </React.Suspense>
  );
};

export default User;
