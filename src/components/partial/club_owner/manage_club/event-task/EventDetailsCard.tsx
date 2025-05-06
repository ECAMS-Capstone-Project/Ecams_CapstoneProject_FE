import { format } from "date-fns";
import { Calendar, Clock, MapPin, Building2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Event } from "@/models/Event";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/FormatPrice";
import { Money } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ConfirmEndEventDialog from "./ConfirmEndEventDialog";
import { EndOneEventAPI } from "@/api/club-owner/TaskAPI";
import toast from "react-hot-toast";

interface EventDetailsCardProps {
  selectedEvent: Event;
  clubId: string;
  isClubOwner: boolean;
}

export const EventDetailsTaskCard = ({
  selectedEvent,
  clubId,
  isClubOwner,
}: EventDetailsCardProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const handleSubmit = async () => {
    await EndOneEventAPI(clubId, selectedEvent.eventId);
    toast.success("End event successfully");
    window.history.back();
  };

  return (
    <div className="relative h-[620px] rounded-xl overflow-hidden shadow-md border border-gray-200">
      {/* Background image */}
      <img
        src="https://blog.topcv.vn/wp-content/uploads/2021/07/nmEvents_Page_Header_2903ed9c-40c1-4f6c-9a69-70bb8415295b.jpg"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <div className="relative z-20 p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between align-middle">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#136cb9]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {selectedEvent.eventName}
              </h1>
              <p className="text-gray-200 mt-1">{selectedEvent.description}</p>
            </div>
          </div>
          {selectedEvent.status == "ENDED" && isClubOwner && (
            <div>
              <Button
                onClick={() => setOpen(true)}
                variant={"custom"}
                className="font-bold"
              >
                End event
              </Button>
            </div>
          )}
        </div>

        {/* Badge */}
        <div className="mb-6">
          <Badge
            variant="outline"
            className="bg-white text-[#136cb9] border-[#136cb9]/20"
          >
            {selectedEvent.eventType}
          </Badge>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
              <Calendar className="w-5 h-5 text-[#136cb9]" />
              <span className="text-[#136cb9]">Registration Period: </span>
              <span className="text-gray-800">
                {format(
                  new Date(selectedEvent.registeredStartDate),
                  "dd/MM/yyyy"
                )}{" "}
                -{" "}
                {format(
                  new Date(selectedEvent.registeredEndDate),
                  "dd/MM/yyyy"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
              <Clock className="w-5 h-5 text-[#136cb9]" />
              <span className="text-[#136cb9]">Time: </span>
              <span className="text-gray-800">
                {format(selectedEvent.registeredStartDate, "HH:mm a")} -{" "}
                {format(selectedEvent.registeredEndDate, "HH:mm a")}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
              <Clock className="w-5 h-5 text-[#136cb9]" />
              <span className="text-[#136cb9]">Training Point: </span>
              <span className="text-gray-800">
                {selectedEvent.trainingPoint} points
              </span>
            </div>
          </div>

          {/* Extra Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
              <MapPin className="w-5 h-5 text-[#136cb9]" />
              <span className="text-[#136cb9]">Areas: </span>
              <span className="text-gray-800">
                {selectedEvent.eventAreas?.map((area) => area.name).join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
              <Money className="w-5 h-5 text-[#136cb9]" />
              <span className="text-[#136cb9]">Price: </span>
              <span className="font-bold text-[#49BBBD]">
                {selectedEvent.price === 0
                  ? "Free"
                  : `${formatPrice(selectedEvent.price)}`}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
              <Building2 className="w-5 h-5 text-[#136cb9]" />
              <span className="text-[#136cb9]">
                Number of Organizing Clubs:
              </span>
              <span className="text-gray-800">
                {selectedEvent.clubs?.length || 0} clubs
              </span>
            </div>
          </div>
        </div>

        {/* Participating Clubs */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-white">
            Participating Clubs
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedEvent.clubs?.map((club, index) => (
              <Badge
                key={index}
                variant={club.status === "ACTIVE" ? "default" : "secondary"}
                className={cn(
                  "text-xs",
                  club.status === "ACTIVE"
                    ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                    : "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
                )}
              >
                {club.clubName} ({club.status})
              </Badge>
            ))}
          </div>
        </div>
        {/* Danh sách khu vực tổ chức */}
        {selectedEvent.eventAreas && selectedEvent.eventAreas.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
              Event Areas
            </h3>
            <div className="overflow-x-auto w-full rounded-lg border border-[#d1e7f5] bg-[#d1e7f5]">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-white border-b border-[#d1e7f5]">
                    <th className="px-5 py-3 text-left text-base font-bold text-[#136cb9] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-5 py-3 text-left text-base font-bold text-[#136cb9] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-5 py-3 text-left text-base font-bold text-[#136cb9] uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEvent.eventAreas.map((area) => (
                    <tr
                      key={area.areaId}
                      className="hover:bg-[#d1e7f5] transition-colors"
                    >
                      <td className="px-5 py-3 whitespace-nowrap text-base font-medium text-gray-900">
                        {area.name}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-base text-gray-700">
                        {format(new Date(area.date), "dd/MM/yyyy")}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-base text-gray-700">
                        {area.startTime} - {area.endTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <ConfirmEndEventDialog
        open={open}
        setOpen={setOpen}
        handleSubmit={handleSubmit}
        title="Do you want to complete this event?"
      />
    </div>
  );
};
