/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import useAuth from "@/hooks/useAuth";
import LoadingAnimation from "@/components/ui/loading";
import { EventDetailsTaskCard } from "./EventDetailsCard";
import TaskListInEvent from "./TaskListInEvent";
import EventParticipants from "@/pages/club-owner/event/EventParticipants";
export const EventDetailTask = () => {
  const { eventId = "" } = useParams();
  const { getEventDetailQuery } = useEvents();
  const { user } = useAuth();
  const location = useLocation();
  const isClubOwner = location.state?.isClubOwner as boolean

  const { data: eventDetail, isLoading: isEventDetailLoading } =
    getEventDetailQuery(eventId, user?.userId || "");

  if (isEventDetailLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <LoadingAnimation />
      </div>
    );
  }

  const event = eventDetail?.data;

  // const getStatusColor = (status: InterClubEventDTO["status"]) => {
  //   switch (status) {
  //     case "WAITING":
  //       return "bg-[#136CB9]/10 text-[#136CB9] border border-[#136CB9]/20";
  //     case "ACTIVE":
  //       return "bg-[#49BBBD]/10 text-[#49BBBD] border border-[#49BBBD]/20";
  //     case "INACTIVE":
  //       return "bg-gray-100 text-gray-800 border border-gray-200";
  //     default:
  //       return "bg-gray-100 text-gray-800 border border-gray-200";
  //   }
  // };

  if (!event) return null;

  return (
    <div className="container mx-auto space-y-6 pb-8">
      {event && (
        <div className="space-y-6">
          <EventDetailsTaskCard selectedEvent={event} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#e5e7eb]">
        <Tabs defaultValue="participant" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#f8f9fa] p-1">
            <TabsTrigger
              value="participant"
              className={cn(
                "data-[state=active]:bg-white data-[state=active]:text-[#136cb9]",
                "data-[state=active]:shadow-sm transition-all duration-200"
              )}
            >
              Participants Event
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className={cn(
                "data-[state=active]:bg-white data-[state=active]:text-[#136cb9]",
                "data-[state=active]:shadow-sm transition-all duration-200"
              )}
            >
              Tasks
            </TabsTrigger>
          </TabsList>
          <div className="p-6">
            <TabsContent value="participant" className="mt-0">
              <EventParticipants eventId={event.eventId} />
            </TabsContent>
            <TabsContent value="tasks" className="mt-0">
              <TaskListInEvent clubId="fad28837-8bd0-46a3-bd80-205a1a7ba97d" isClubOwner={isClubOwner} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
