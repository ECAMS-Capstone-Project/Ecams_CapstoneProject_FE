import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { GetStudentAPI } from "@/api/staff/StudentAPI";
import StudentRequest from "@/models/StudentRequest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const ApproveStudentTable = React.lazy(
  () => import("@/components/partial/staff/staff-approve/ApproveStudentTable")
);

const ApproveStudentPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stuList, setStuList] = useState<StudentRequest[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [flag, setFlag] = useState<boolean>(false);
  useEffect(() => {
    const loadRequestStudent = async () => {
      try {
        const uniData = await GetStudentAPI(pageSize, pageNo);

        if (uniData) {
          setStuList(uniData.data?.data || []); // Đảm bảo `data.data` tồn tại
          setTotalPages(uniData.data?.totalPages || 1); // Đặt số trang
        } else {
          console.warn("Student returned no data");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequestStudent();
  }, [pageNo, pageSize, flag]);

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {/* Hiển thị spinner nếu API chưa tải xong */}
      {(isLoading) ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex items-center justify-between pt-4">
            <Heading
              title={`Manage Request Student`}
              description="Approve request student in the system"
            />
          </div>
          <Separator />

          <Tabs
            defaultValue="request"
            // value={activeTab}
            // onValueChange={setActiveTab}
            className="w-full mt-3 p-2"
          >
            <TabsList>
              <TabsTrigger value="request">Pending Request</TabsTrigger>
              <TabsTrigger value="registered">
                Registered University
              </TabsTrigger>
            </TabsList>

            <TabsContent value="registered">
              <ApproveStudentTable
                data={stuList.filter((uni) => uni.status !== "CHECKING")}
              />
              <DataTablePagination
                currentPage={pageNo}
                totalPages={totalPages}
                pageSize={pageSize}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
              />
            </TabsContent>
            <TabsContent value="request">
              <ApproveStudentTable
                data={stuList.filter((uni) => uni.status === "CHECKING")}
                setFlag={setFlag}
              />
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

export default ApproveStudentPage;
