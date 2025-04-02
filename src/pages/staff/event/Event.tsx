import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import EventTable from "@/components/partial/staff/staff-events/EventTable";
import { useNavigate } from "react-router-dom";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";

const Events = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // const [, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
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
  const { events, isLoading, totalPages } = useEvents(
    userInfo?.universityId,
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
              title={`Manage Events`}
              description={`Oversee and manage events at ${userInfo?.universityName}`}
            />

            {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger> */}
            <Button
              onClick={() => navigate("/representative/event/new")}
              className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
            {/* </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <CreateEventDialog
                  initialData={null}
                  onSuccess={() => {}}
                  setOpen={handleCloseDialog}
                />
              </DialogContent>
            </Dialog> */}
          </div>
          <Separator />
          <Tabs
            defaultValue="uni"
            // value={activeTab}
            // onValueChange={setActiveTab}
            className="w-full mt-3 p-2"
          >
            <TabsList>
              <TabsTrigger value="request">Event's Request</TabsTrigger>

              <TabsTrigger value="uni">University's Event</TabsTrigger>
              <TabsTrigger value="club">Club's Event</TabsTrigger>
            </TabsList>

            <TabsContent value="uni">
              <EventTable
                data={events.filter(
                  (events) =>
                    events.representativeId != null &&
                    events.status != "PENDING"
                )}
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
              <EventTable
                data={events.filter((events) => events.status == "PENDING")}
              />
              <DataTablePagination
                currentPage={pageNo}
                totalPages={totalPages}
                pageSize={pageSize}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
              />
            </TabsContent>
            <TabsContent value="club">
              <EventTable
                data={events.filter(
                  (events) =>
                    events.clubs.length > 0 &&
                    events.status != "PENDING" &&
                    events.representativeId == null
                )}
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

export default Events;
