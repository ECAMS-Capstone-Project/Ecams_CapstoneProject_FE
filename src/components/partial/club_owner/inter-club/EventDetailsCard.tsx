import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Building2,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { InterClubEventDTO } from "@/models/Event";
import { useNavigate } from "react-router-dom";

interface EventDetailsCardProps {
  selectedEvent: InterClubEventDTO;
}

export const EventDetailsCard = ({ selectedEvent }: EventDetailsCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#136cb9]/10 rounded-xl shadow-sm overflow-hidden border border-[#e5e7eb] p-6">
      {/* Header với nút back */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#136cb9]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#136cb9]">
            {selectedEvent.eventName}
          </h1>
          <p className="text-gray-600 mt-1">{selectedEvent.description}</p>
        </div>
      </div>

      {/* Badge loại event */}
      <div className="mb-6">
        <Badge
          variant="outline"
          className="bg-white text-[#136cb9] border-[#136cb9]/20"
        >
          {selectedEvent.eventType}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin cơ bản */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white shadow-sm">
            <Calendar className="w-5 h-5 text-[#136cb9]" />
            <span className="text-gray-700">
              {format(
                new Date(selectedEvent.registeredStartDate),
                "dd/MM/yyyy"
              )}{" "}
              -{format(new Date(selectedEvent.registeredEndDate), "dd/MM/yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white shadow-sm">
            <Clock className="w-5 h-5 text-[#136cb9]" />
            <span className="text-gray-700">
              {format(new Date(selectedEvent.registeredStartDate), "HH:mm")} -
              {format(new Date(selectedEvent.registeredEndDate), "HH:mm")}
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white shadow-sm">
            <Users className="w-5 h-5 text-[#136cb9]" />
            <span className="text-gray-700">
              {selectedEvent.numOfParticipants}/{selectedEvent.maxParticipants}{" "}
              participants
            </span>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white shadow-sm">
            <MapPin className="w-5 h-5 text-[#136cb9]" />
            <span className="text-gray-700">
              Areas:{" "}
              {selectedEvent.eventAreas?.map((area) => area.name).join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white shadow-sm">
            <Building2 className="w-5 h-5 text-[#136cb9]" />
            <span className="text-gray-700">
              {selectedEvent.clubs?.length || 0} clubs
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white shadow-sm">
            <span className="text-gray-700">Price: </span>
            <span className="font-medium text-[#136cb9]">
              {selectedEvent.price === 0 ? "Free" : `$${selectedEvent.price}`}
            </span>
          </div>
        </div>
      </div>

      {/* Danh sách club tham gia */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-[#136cb9]">
          Participating Clubs
        </h3>
        <div className="flex flex-wrap gap-2">
          {selectedEvent.clubs?.map((club) => (
            <Badge
              key={club.clubId}
              variant={club.status === "ACTIVE" ? "default" : "secondary"}
              className={cn(
                "text-xs",
                club.status === "ACTIVE"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
              )}
            >
              {club.clubName} ({club.status})
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
