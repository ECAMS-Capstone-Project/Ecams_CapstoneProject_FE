import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { GetStudentInUniversityAPI } from "@/api/representative/StudentAPI";
import StudentRequest from "@/models/StudentRequest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";

// Lazy load bảng (nếu muốn)
const ApproveStudentTable = React.lazy(
  () =>
    import(
      "@/components/partial/representative/representative-approve/ApproveStudentTable"
    )
);

const ApproveStudentPage = () => {
  const { user } = useAuth();

  // State cho dữ liệu
  const [isLoading, setIsLoading] = useState(true);
  const [stuList, setStuList] = useState<StudentRequest[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // State để refresh data sau khi duyệt
  const [flag, setFlag] = useState<boolean>(false);

  // State cho tab
  const [activeTab, setActiveTab] = useState<"request" | "registered">(
    "request"
  );

  useEffect(() => {
    const loadRequestStudent = async () => {
      try {
        if (!user?.universityId) {
          throw new Error("University ID is undefined");
        }

        setIsLoading(true);

        // Xác định status theo tab
        const status = activeTab === "request" ? "CHECKING" : "ACTIVE";

        // Gọi API với status tương ứng
        const uniData = await GetStudentInUniversityAPI(
          user.universityId,
          pageSize,
          pageNo,
          status
        );

        if (uniData) {
          setStuList(uniData.data?.data || []);
          setTotalPages(uniData.data?.totalPages || 1);
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
  }, [activeTab, pageNo, pageSize, flag, user]);

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex items-center justify-between pt-4">
            <Heading
              title="Manage student"
              description={`View all information of students in ${user?.universityName}`}
            />
          </div>
          <Separator />

          <Tabs
            // Điều khiển tab bằng state
            value={activeTab}
            onValueChange={(val) =>
              setActiveTab(val as "request" | "registered")
            }
            className="w-full mt-3 p-2"
          >
            <TabsList>
              <TabsTrigger value="request">Pending Request</TabsTrigger>
              <TabsTrigger value="registered">Active Student</TabsTrigger>
            </TabsList>

            {/* Tab 1: Pending (CHECKING) */}
            <TabsContent value="request">
              <ApproveStudentTable data={stuList} setFlag={setFlag} />
              <DataTablePagination
                currentPage={pageNo}
                totalPages={totalPages}
                pageSize={pageSize}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
              />
            </TabsContent>

            {/* Tab 2: Active (ACTIVE) */}
            <TabsContent value="registered">
              <ApproveStudentTable data={stuList} />
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
