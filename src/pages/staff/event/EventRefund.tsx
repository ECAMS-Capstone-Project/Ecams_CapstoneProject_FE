import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import EventTable from "@/components/partial/staff/staff-events/EventTable";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";

const EventRefunds = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  // const [, setIsDialogOpen] = useState(false);
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
              title={`Manage Events' Refund Request`}
              description={`Oversee and manage events refund at ${userInfo?.universityName}`}
            />
          </div>
          <Separator />

          <EventTable
            data={events.filter(
              (events) => events.clubs.length > 0 && events.status == "CANCELED"
            )}
          />
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

export default EventRefunds;
