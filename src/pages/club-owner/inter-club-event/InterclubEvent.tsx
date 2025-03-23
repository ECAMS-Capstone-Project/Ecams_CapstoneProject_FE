import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateInterClubEvent } from "@/components/partial/club_owner/inter-club/CreateInterClubEvent";
import { InterClubChat } from "@/components/partial/club_owner/inter-club/InterClubChat";
import { InterClubTask } from "@/components/partial/club_owner/inter-club/InterClubTask";
import { InterClubEventList } from "@/components/partial/club_owner/inter-club/InterClubEventList";
import { EventDetailsCard } from "@/components/partial/club_owner/inter-club/EventDetailsCard";

export interface InterClubEvent {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  price: number;
  participatingClubs: string[];
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
}

export const InterClubEvent = () => {
  const [, setActiveTab] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState<InterClubEvent | null>(
    null
  );

  // TODO: Replace with actual API call
  //   const mockEvent: InterClubEvent = {
  //     id: "1",
  //     name: "Tech Workshop 2024",
  //     description: "A collaborative workshop between tech clubs",
  //     startDate: new Date("2024-04-01"),
  //     endDate: new Date("2024-04-03"),
  //     maxParticipants: 100,
  //     price: 0,
  //     participatingClubs: ["Tech Club A", "Tech Club B", "Innovation Club"],
  //     status: "UPCOMING",
  //   };

  return (
    <div className="container mx-auto ">
      <div className="  mb-6 ">
        <h1 className="text-3xl font-bold text-[#136cb9] mb-2">
          Inter-Club Event Management
        </h1>
        <p className="text-muted-foreground">
          Manage and collaborate on inter-club events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs
            defaultValue="events"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger
                value="create"
                onClick={() => setSelectedEvent(null)}
              >
                Create Event
              </TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <InterClubEventList onEventSelect={setSelectedEvent} />
            </TabsContent>

            <TabsContent value="create">
              <CreateInterClubEvent />
            </TabsContent>

            <TabsContent value="chat">
              <InterClubChat selectedEvent={selectedEvent} />
            </TabsContent>

            <TabsContent value="tasks">
              <InterClubTask selectedEvent={selectedEvent} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Event Details Sidebar */}
        {selectedEvent && (
          <div className="lg:col-span-1">
            <EventDetailsCard selectedEvent={selectedEvent} />
          </div>
        )}
      </div>
    </div>
  );
};
