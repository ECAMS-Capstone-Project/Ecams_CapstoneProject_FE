import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Calendar,
  Building2,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { InterClubEventDTO } from "@/models/Event";
import { useClubs } from "@/hooks/student/useClub";
import { useNavigate } from "react-router-dom";
import { useEventDetail } from "@/hooks/club/useEventDetail";
import useAuth from "@/hooks/useAuth";

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

  const club = clubs?.filter((club) =>
    club.clubMembers?.some(
      (member) =>
        member.userId === user?.userId && member.clubRoleName === "CLUB_OWNER"
    )
  );

  const { GetInterClubEvent } = useEventDetail();
  const { data: interEvents } = GetInterClubEvent(
    club?.[0]?.clubId || "",
    pageSize,
    pageNo
  );
  const events = interEvents?.data?.data || [];
  console.log("events", events);
  const getStatusColor = (status: InterClubEventDTO["status"]) => {
    switch (status) {
      case "WAITING":
        return "bg-blue-100 text-blue-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "ENDED":
        return "bg-gray-100 text-gray-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "INACTIVE":
        return "bg-black-100 text-black-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const filteredEvents = events.filter((event) => {
    // Filter theo search query
    const matchesSearch = event.eventName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter theo status của clubs
    const matchesStatus =
      selectedStatus === "ALL" || event.status === selectedStatus;

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
          {(
            [
              "ALL",
              "PENDING",
              "ACTIVE",
              "WAITING",
              "ENDED",
              "CANCELED",
            ] as const
          ).map((status) => (
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
              className="bg-white rounded-xl border border-[#e5e7eb] p-5 hover:border-[#136cb9] hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleEventSelect(event.clubEventId)}
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Phần ảnh sự kiện */}
                <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.eventName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Phần thông tin sự kiện */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-[#136cb9]">
                      {event.eventName}
                    </h3>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        getStatusColor(
                          event.status as InterClubEventDTO["status"]
                        )
                      )}
                    >
                      {event.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                      <Calendar className="h-4 w-4 text-[#136cb9]" />
                      <span className="text-sm text-muted-foreground">
                        {format(event.registeredStartDate, "MMM d")} -{" "}
                        {format(event.registeredEndDate, "MMM d")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                      <Building2 className="h-4 w-4 text-[#136cb9]" />
                      <span className="text-sm text-muted-foreground">
                        {event.clubs.length} clubs
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                      <Users className="h-4 w-4 text-[#136cb9]" />
                      <span className="text-sm text-muted-foreground">
                        {event.price === 0
                          ? "Free"
                          : `${event.price.toLocaleString()} VND`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
