import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { ViewNotiDialog } from "@/components/partial/admin/notification/ViewNotiDialog";
import { useNotification } from "@/hooks/admin/useNoti";
const NotiTable = React.lazy(
  () => import("@/components/partial/admin/notification/NotiTable")
);

const Notifications = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // useEffect(() => {
  //   const loadPackage = async () => {
  //     try {
  //       //   // Tải cả component lười biếng và dữ liệu API song song
  //       const notiData = await getNotification(pageSize, pageNo);
  //       setNotification(notiData.data?.data || []); // Đảm bảo `data.data` tồn tại
  //       setTotalPages(notiData.data?.totalPages || 1); // Đặt số trang
  //     } catch (error) {
  //       console.error("Error loading data:", error);
  //     } finally {
  //       setIsLoading(false); // Hoàn tất tải
  //     }
  //   };
  //   loadPackage();
  // }, [pageNo, pageSize]);
  const { notifications, totalPages, isLoading } = useNotification(
    pageNo,
    pageSize
  );
  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {/* Hiển thị spinner nếu API chưa tải xong */}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex items-center justify-between pt-4">
            <Heading
              title={`Manage System Notifications`}
              description="Manage System Notifications in the system"
            />

            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-lg">
                <ViewNotiDialog
                  initialData={null}
                  onClose={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          <NotiTable data={notifications} />
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

export default Notifications;
