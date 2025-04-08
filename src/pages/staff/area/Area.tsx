import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { Area } from "@/models/Area";
import { useAreas } from "@/hooks/staff/Area/useArea";
import { EditAreaDialog } from "@/components/partial/staff/staff-area/EditAreaDialog";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";

const AreaTable = React.lazy(
  () => import("@/components/partial/staff/staff-area/AreaTable")
);
const Area = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  // const [totalPages, setTotalPages] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getCurrentUserAPI();
        if (userInfo) {
          setUserInfo(userInfo.data);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, []);
  // const [pageNo, setPageNo] = useState(1);
  // const [pageSize, setPageSize] = useState(5);

  // ✅ Lấy danh sách từ `useAreas()`
  const { areas, isLoading, totalPages } = useAreas(
    pageNo,
    pageSize,
    userInfo?.universityId ?? ""
  );

  // ✅ Hàm reload danh sách sau khi thêm mới
  // const handleAreaAdded = () => {
  //   refetchAreas(); // Tự động reload danh sách mà không cần state
  // };
  const handleCloseDialog = () => setIsDialogOpen(false);
  // const loadArea = async () => {
  //   try {
  //     const areaData = await getAreaList(pageSize, pageNo);
  //     if (areaData) {
  //       setAreaList(areaData.data?.data || []); // Đảm bảo `data.data` tồn tại
  //       setTotalPages(areaData.data?.totalPages || 1); // Đặt số trang
  //     } else {
  //       console.warn("AreaList returned no data");
  //     }
  //   } catch (error) {
  //     console.error("Error loading data:", error);
  //   } finally {
  //     setIsLoading(false); // Hoàn tất tải
  //   }
  // };

  // useEffect(() => {
  //   loadArea();
  // }, [pageNo, pageSize]);

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {/* Hiển thị spinner nếu API chưa tải xong */}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex items-center justify-between pt-4">
            <Heading
              title={`Manage Area`}
              description={`View and manage all areas of ${userInfo?.universityName}`}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger>
                <Button className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <EditAreaDialog
                  initialData={null}
                  onSuccess={() => {}}
                  setOpen={handleCloseDialog}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />

          <AreaTable data={areas} />
          <DataTablePagination
            currentPage={pageNo}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageNo={setPageNo}
            setPageSize={setPageSize}
          />
        </>
      )}
    </React.Suspense>
  );
};

export default Area;
