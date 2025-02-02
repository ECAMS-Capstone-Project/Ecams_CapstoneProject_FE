import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { Noti } from "@/models/Notification";
import { getNotification } from "@/api/agent/NotiAgent";
import { ViewNotiDialog } from "@/components/partial/admin/notification/ViewNotiDialog";
const NotiTable = React.lazy(
  () => import("@/components/partial/admin/notification/NotiTable")
);

const Notifications = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<Noti[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages] = useState(0);
  useEffect(() => {
    const loadPackage = async () => {
      try {
        //   // Tải cả component lười biếng và dữ liệu API song song
        // const packageData = await PackageList(pageSize, pageNo);
        // setPackageList(packageData.data?.data || []); // Đảm bảo `data.data` tồn tại
        // setTotalPages(packageData.data?.totalPages || 1); // Đặt số trang
        const notiData = await getNotification();
        setNotification(notiData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false); // Hoàn tất tải
      }
    };
    loadPackage();
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
              title={`Manage System Notifications`}
              description="Manage System Notifications in the system"
            />

            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-lg">
                <ViewNotiDialog initialData={null} />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          <NotiTable data={notification} />
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
