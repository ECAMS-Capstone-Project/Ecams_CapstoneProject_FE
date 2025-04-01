import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Calendar, Building2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import { InterClubEventDTO } from "@/models/Event";
import { useClubs } from "@/hooks/student/useClub";
import { useNavigate } from "react-router-dom";
import { useEventDetail } from "@/hooks/club/useEventDetail";

export const InterClubEventList = () => {
  const [pageNo] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    InterClubEventDTO["status"] | "ALL"
  >("ALL");
  const navigate = useNavigate();

  const handleEventSelect = (clubEventId: string) => {
    navigate(`/club/inter-club-event/${clubEventId}`);
  };
  const { user } = useAuth();
  const { clubs } = useClubs(user?.universityId, 1, 20);
  console.log("clubs", clubs);

  const club = clubs?.filter((club) =>
    club.clubMembers?.some(
      (member) =>
        member.userId === user?.userId && member.clubRoleName === "CLUB_OWNER"
    )
  );

  console.log("club", club);

  const { GetInterClubEvent } = useEventDetail();
  const { data: interEvents } = GetInterClubEvent(
    club?.[0]?.clubId || "",
    pageSize,
    pageNo
  );
  const events = interEvents?.data?.data || [];
  // const { GetInterClubEventRequest } = useEventDetail();
  // const { data: interEventRequest } = GetInterClubEventRequest(
  //   clubId || "",
  //   pageSize,
  //   pageNo
  // );

  const getStatusColor = (status: InterClubEventDTO["status"]) => {
    switch (status) {
      case "WAITING":
        return "bg-blue-100 text-blue-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEvents = events.filter((event) => {
    // Filter theo search query
    const matchesSearch = event.eventName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter theo status của clubs
    const matchesStatus =
      selectedStatus === "ALL" ||
      event.clubs.some(
        (eventClub) =>
          eventClub.status === selectedStatus &&
          eventClub.clubId === club?.[0]?.clubId
      );

    return matchesSearch && matchesStatus;
  });

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
          {(["ALL", "PENDING", "ACTIVE"] as const).map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "custom" : "outline"}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "transition-all duration-200",
                selectedStatus === status && " hover:bg-[#136cb9]/90"
              )}
            >
              {status === "PENDING" ? "Requests" : status}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div
              key={event.eventId}
              className="bg-white rounded-xl border border-[#e5e7eb] p-4 hover:border-[#136cb9] transition-all duration-200 cursor-pointer"
              onClick={() => handleEventSelect(event.clubEventId)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#136cb9] mb-1">
                    {event.eventName}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {event.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    getStatusColor(event.status as InterClubEventDTO["status"])
                  )}
                >
                  {event.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#136cb9]" />
                  <span className="text-sm text-muted-foreground">
                    {format(event.registeredEndDate, "MMM d")} -{" "}
                    {format(event.registeredEndDate, "MMM d")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#136cb9]" />
                  <span className="text-sm text-muted-foreground">
                    {event.clubs.length} clubs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {event.price === 0
                      ? "Free"
                      : `${event.price.toLocaleString()} VND`}
                  </span>
                </div>
              </div>

              {/* Hiển thị câu lạc bộ tạo sự kiện */}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
