import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { University } from "@/models/University";
import { UniversityList } from "@/api/agent/UniversityAgent";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
const UniversityTable = React.lazy(
  () => import("@/components/partial/admin/university/UniversityTable")
);

const University = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [uniList, setUniList] = useState<University[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    const loadUniversity = async () => {
      try {
        const uniData = await UniversityList(pageSize, pageNo);

        if (uniData) {
          setUniList(uniData.data?.data || []); // Đảm bảo `data.data` tồn tại
          setTotalPages(uniData.data?.totalPages || 1); // Đặt số trang
        } else {
          console.warn("UniversityList returned no data");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false); // Hoàn tất tải
      }
    };

    loadUniversity();
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
              title={`Manage University`}
              description="Manage University in the system"
            />
          </div>
          <Separator />
          <Tabs defaultValue="request" className="w-full mt-3 p-2">
            <TabsList>
              <TabsTrigger value="request">Pending Request</TabsTrigger>
              <TabsTrigger value="registered">
                Registered University
              </TabsTrigger>
            </TabsList>

            <TabsContent value="registered">
              <UniversityTable
                data={uniList.filter((uni) => uni.status !== "PENDING")}
              />
            </TabsContent>
            <TabsContent value="request">
              <UniversityTable
                data={uniList.filter((uni) => uni.status === "PENDING")}
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

export default University;
