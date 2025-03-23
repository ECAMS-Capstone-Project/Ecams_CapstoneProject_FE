import { InterClubEvent } from "@/pages/club-owner/inter-club-event/InterclubEvent";
import { format } from "date-fns";
import { Calendar, Users, Building2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventDetailsCardProps {
  selectedEvent: InterClubEvent;
}

export const EventDetailsCard = ({ selectedEvent }: EventDetailsCardProps) => {
  const getStatusColor = (status: InterClubEvent["status"]) => {
    switch (status) {
      case "UPCOMING":
        return "bg-[#136CB9]/10 text-[#136CB9] border border-[#136CB9]/20";
      case "ONGOING":
        return "bg-[#49BBBD]/10 text-[#49BBBD] border border-[#49BBBD]/20";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <div className="p-6 border border-[#e5e7eb] rounded-lg bg-gradient-to-br from-[#136CB9]/5 via-[#49BBBD]/5 to-[#136CB9]/5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#136cb9]">
          {selectedEvent.name}
        </h2>
        <span
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            getStatusColor(selectedEvent.status)
          )}
        >
          {selectedEvent.status}
        </span>
      </div>
      <p className="text-muted-foreground mb-4">{selectedEvent.description}</p>
      <div className="rounded-lg bg-white/50 border border-[#e5e7eb]">
        <div className="flex items-center gap-3 p-2 ">
          <Calendar className="h-5 w-5 text-[#136cb9]" />
          <div>
            <p className="text-sm font-medium">Event Period</p>
            <p className="text-sm text-muted-foreground">
              {format(selectedEvent.startDate, "MMM d, yyyy")} -{" "}
              {format(selectedEvent.endDate, "MMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <Users className="h-5 w-5 text-[#136cb9]" />
          <div>
            <p className="text-sm font-medium">Max Participants</p>
            <p className="text-sm text-muted-foreground">
              {selectedEvent.maxParticipants} people
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <Building2 className="h-5 w-5 text-[#136cb9]" />
          <div>
            <p className="text-sm font-medium">Participating Clubs</p>
            <p className="text-sm text-muted-foreground">
              {selectedEvent.participatingClubs.length} clubs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 ">
          <Clock className="h-5 w-5 text-[#136cb9]" />
          <div>
            <p className="text-sm font-medium">Price</p>
            <p className="text-sm text-muted-foreground">
              {selectedEvent.price === 0 ? "Free" : `$${selectedEvent.price}`}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">Participating Clubs</h3>
        <div className="space-y-2">
          {selectedEvent.participatingClubs.map((club) => (
            <div
              key={club}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/50 border border-[#e5e7eb] hover:bg-white hover:border-[#136cb9]/20 transition-all duration-200"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#136CB9]/10 to-[#49BBBD]/10 flex items-center justify-center border border-[#136cb9]/20">
                <span className="text-sm font-medium text-[#136cb9]">
                  {club.charAt(0)}
                </span>
              </div>
              <span className="text-sm">{club}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
