import { EventRefund } from "@/components/partial/staff/staff-events/EventRefund";
import { EventDetail } from "@/components/partial/staff/staff-events/ViewEventDialog";
import LoadingAnimation from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import useAuth from "@/hooks/useAuth";
import { CornerDownLeftIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import RepresentativeEventParticipants from "./EventParticipants";
import { isArray } from "lodash";

const StaffEventDetailPage = () => {
  const navigate = useNavigate();
  const { eventId = "" } = useParams();
  const { getEventDetailQuery } = useEvents();
  const { user } = useAuth();
  const {
    data: eventDetail,
    isLoading: isEventDetailLoading,
    error,
  } = getEventDetailQuery(eventId, user?.userId || "");

  if (isEventDetailLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Error loading event details: {error.message}
      </div>
    );
  }
  console.log("stt", eventDetail?.data?.status);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="flex justify-start items-center gap-2">
          <CornerDownLeftIcon
            size={24}
            onClick={() => navigate(-1)}
            className="cursor-pointer stroke-[#136CB5] hover:stroke-[#36b6b9] transition duration-300"
          />

          <h2 className="font-bold text-3xl  bg-gradient-to-r from-[#136CB5] to-[#49BBBD] bg-clip-text text-transparent">
            Event Detailed Information
          </h2>
        </div>
      </div>
      <Separator />
      <Tabs defaultValue="detail" className="mt-4">
        <TabsList>
          <TabsTrigger value="detail">Detailed Information</TabsTrigger>

          {isArray(eventDetail?.data?.eventRegistrations) &&
            eventDetail?.data?.eventRegistrations?.length > 0 &&
            eventDetail?.data?.status.toLowerCase() == "canceled" && (
              <TabsTrigger value="refund">Refund requests</TabsTrigger>
            )}
          <TabsTrigger value="statistic">Event statistic</TabsTrigger>
        </TabsList>
        <TabsContent value="detail">
          <EventDetail />
        </TabsContent>
        <TabsContent value="statistic">
          <RepresentativeEventParticipants
            eventId={eventId}
            totalRevenue={eventDetail?.data?.totalRevenue || 0}
          />
        </TabsContent>

        {isArray(eventDetail?.data?.eventRegistrations) &&
          eventDetail?.data?.eventRegistrations?.length > 0 &&
          eventDetail?.data?.status.toLowerCase() == "canceled" && (
            <TabsContent value="refund">
              {eventDetail?.data && <EventRefund event={eventDetail.data} />}
            </TabsContent>
          )}
      </Tabs>
    </div>
  );
};

export default StaffEventDetailPage;
