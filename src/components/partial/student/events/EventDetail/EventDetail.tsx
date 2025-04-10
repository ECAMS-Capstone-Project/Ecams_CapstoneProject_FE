import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import LoadingAnimation from "@/components/ui/loading";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import { OtherEvents } from "./OtherEvent";
import { BreadcrumbNav } from "./BreadcrumbNav";
import { HeroSection } from "./HeroSection";
import { EventDetailLeft } from "./EventDetailLeft";
import { EventDetailRight } from "./EventDetailRight";
import { EventFeedback } from "./EventFeedback";
import useAuth from "@/hooks/useAuth";

export const StudentEventDetail: React.FC = () => {
  const [pageNo] = useState(1);
  const [pageSize] = useState(7);
  const { eventId = "" } = useParams();
  const { user } = useAuth();
  const { getEventDetailQuery, getAllEventListQuery } = useEvents();
  const location = useLocation();

  // Lấy thông tin trang trước (truyền qua state khi navigate)
  const previousPage = location.state?.previousPage || "/student/event";
  const breadcrumbLabel = location.state?.breadcrumb || "Event";

  const { data: eventDetail, isLoading: isEventDetailLoading } =
    getEventDetailQuery(eventId, user?.userId || "");
  const { data: eventData } = getAllEventListQuery(pageNo, pageSize);

  if (isEventDetailLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <LoadingAnimation />
      </div>
    );
  }

  const event = eventDetail?.data;
  const events = eventData?.data?.data;

  // Kiểm tra xem sự kiện đã kết thúc chưa
  const isEventEnded = event?.status ? event.status === "ENDED" : false;

  return (
    <div className="flex min-h-screen flex-col px-14 py-5">
      <BreadcrumbNav
        previousPage={previousPage}
        breadcrumbLabel={breadcrumbLabel}
        eventName={event?.eventName}
      />
      <main className="flex-1">
        {event && <HeroSection event={event} />}
        <section className="container mx-auto grid grid-cols-1 space-x-20 px-8 py-8 md:grid-cols-2">
          {event && <EventDetailLeft event={event} />}
          {event && <EventDetailRight event={event} />}
        </section>

        {event && user && (
          <div className="p-8">
            <EventFeedback
              eventId={eventId}
              studentId={user.userId}
              isEventEnded={isEventEnded}
            />
          </div>
        )}
        <OtherEvents
          events={events || []}
          curEventId={eventId}
          previousPage={previousPage}
          breadcrumbLabel={breadcrumbLabel}
        />
      </main>
    </div>
  );
};

export default StudentEventDetail;
