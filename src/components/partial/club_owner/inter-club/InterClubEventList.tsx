import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Calendar, Users, Building2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { InterClubEvent } from "@/pages/club-owner/inter-club-event/InterclubEvent";

interface InterClubEventListProps {
  onEventSelect: (event: InterClubEvent) => void;
}

export const InterClubEventList = ({
  onEventSelect,
}: InterClubEventListProps) => {
  const [events, setEvents] = useState<InterClubEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    InterClubEvent["status"] | "ALL"
  >("ALL");

  // TODO: Implement API call to fetch events
  useEffect(() => {
    // Mock data
    const mockEvents: InterClubEvent[] = [
      {
        id: "1",
        name: "Tech Workshop 2024",
        description:
          "A collaborative workshop between tech clubs A collaborative workshop between tech clubs A collaborative workshop between tech clubs A collaborative workshop between tech clubs",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2024-04-03"),
        maxParticipants: 100,
        price: 0,
        participatingClubs: ["Tech Club A", "Tech Club B", "Innovation Club"],
        status: "UPCOMING",
      },
      {
        id: "2",
        name: "Sports Tournament",
        description: "Annual sports competition between clubs",
        startDate: new Date("2024-03-15"),
        endDate: new Date("2024-03-20"),
        maxParticipants: 200,
        price: 10,
        participatingClubs: ["Sports Club", "Fitness Club", "Athletics Club"],
        status: "ONGOING",
      },
      {
        id: "3",
        name: "Art Exhibition",
        description: "Showcasing artworks from various art clubs",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-02-05"),
        maxParticipants: 150,
        price: 5,
        participatingClubs: ["Art Club", "Photography Club", "Design Club"],
        status: "COMPLETED",
      },
    ];

    setEvents(mockEvents);
  }, []);

  const getStatusColor = (status: InterClubEvent["status"]) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-800";
      case "ONGOING":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedStatus === "ALL" || event.status === selectedStatus)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#136cb9]" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "UPCOMING", "ONGOING", "COMPLETED"] as const).map(
            (status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "custom" : "outline"}
                onClick={() => setSelectedStatus(status)}
                className={cn(
                  "transition-all duration-200",
                  selectedStatus === status && " hover:bg-[#136cb9]/90"
                )}
              >
                {status}
              </Button>
            )
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-[#e5e7eb] p-4 hover:border-[#136cb9] transition-all duration-200 cursor-pointer"
              onClick={() => onEventSelect(event)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#136cb9] mb-1">
                    {event.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {event.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    getStatusColor(event.status)
                  )}
                >
                  {event.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#136cb9]" />
                  <span className="text-sm text-muted-foreground">
                    {format(event.startDate, "MMM d")} -{" "}
                    {format(event.endDate, "MMM d")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#136cb9]" />
                  <span className="text-sm text-muted-foreground">
                    {event.maxParticipants} participants
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#136cb9]" />
                  <span className="text-sm text-muted-foreground">
                    {event.participatingClubs.length} clubs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {event.price === 0 ? "Free" : `$${event.price}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
