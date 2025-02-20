import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import EventTable from "@/components/partial/staff/staff-events/EventTable";

const Events = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const [pageNo, setPageNo] = useState(1);
  // const [pageSize, setPageSize] = useState(5);

  // ✅ Lấy danh sách từ `useAreas()`
  const { events, isLoading } = useEvents();

  // ✅ Hàm reload danh sách sau khi thêm mới
  // const handleAreaAdded = () => {
  //   refetchAreas(); // Tự động reload danh sách mà không cần state
  // };
  // const handleCloseDialog = () => setIsDialogOpen(false);
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
              title={`Manage Events`}
              description="Manage Event in the system"
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger>
                <Button className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                {/* <ViewAreaDialog
                  initialData={null}
                  onSuccess={handleAreaAdded}
                  setOpen={handleCloseDialog}
                /> */}
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          <Tabs
            defaultValue="active"
            // value={activeTab}
            // onValueChange={setActiveTab}
            className="w-full mt-3 p-2"
          >
            <TabsList>
              <TabsTrigger value="active">Active Event</TabsTrigger>
              <TabsTrigger value="request">Request Event</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <EventTable
                data={events.filter((events) => events.status != "PENDING")}
              />
            </TabsContent>
            <TabsContent value="request">
              <EventTable
                data={events.filter((events) => events.status == "PENDING")}
              />
            </TabsContent>

            <DataTablePagination
              currentPage={pageNo}
              totalPages={totalPages}
              pageSize={pageSize}
              setPageNo={setPageNo}
              setPageSize={setPageSize}
            />
          </Tabs>
        </>
      )}
    </React.Suspense>
  );
};

export default Events;
