import { format } from "date-fns";
import { Calendar, Users, MapPin, Building2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { InterClubEventDTO } from "@/models/Event";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/FormatPrice";
import { Money } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { EndEventDialog } from "./EndEventDialog";
import { useEventDetail } from "@/hooks/club/useEventDetail";
import { EventClubDTO } from "@/api/representative/EventAgent";
import toast from "react-hot-toast";
import { ClubResponse } from "@/models/Club";

interface EventDetailsCardProps {
  selectedEvent: InterClubEventDTO;
  currentClub: EventClubDTO | ClubResponse;
}

export const EventDetailsCard = ({
  selectedEvent,
  currentClub,
}: EventDetailsCardProps) => {
  const navigate = useNavigate();
  const [isEndEventDialogOpen, setIsEndEventDialogOpen] = useState(false);
  const { endInterEvent, isEnding } = useEventDetail();
  const [isHostEnded, setIsHostEnded] = useState(false); // Trạng thái của club host đã kết thúc sự kiện chưa
  const [remainingClubsPercentage, setRemainingClubsPercentage] =
    useState<number>(0); // Tỷ lệ phần trăm của các club còn lại đã kết thúc

  useEffect(() => {
    // Kiểm tra xem club host đã bấm "End Event" chưa
    const hostClub = selectedEvent.clubs.find((club) => club.isHost);
    setIsHostEnded(hostClub?.isEnd ?? false);

    // Tính tỷ lệ phần trăm của các club còn lại đã kết thúc sự kiện
    const totalClubs = selectedEvent.clubs.length;
    const endedClubs = selectedEvent.clubs.filter((club) => club.isEnd).length;
    const percentage = ((endedClubs / totalClubs) * 100).toFixed(0);

    setRemainingClubsPercentage(Number(percentage));
  }, [selectedEvent.clubs]); // Khi danh sách clubs thay đổi, tính lại tỷ lệ phầ
  const handleEndEvent = async () => {
    // TODO: Implement end event logic here
    console.log("Ending event:", selectedEvent.eventId);

    await endInterEvent({
      eventId: selectedEvent.eventId,
      clubId: currentClub.clubId,
    });
    toast.success("Event ended successfully!");
    setIsEndEventDialogOpen(false);
  };
  const isHost = selectedEvent.clubs.find(
    (club) => club.clubId === currentClub.clubId
  )?.isHost;
  // const isEnded = selectedEvent.clubs.find(
  //   (club) => club.clubId == currentClub.clubId
  // )?.isEnd;

  console.log("ishost end", isHostEnded);

  return (
    <div className="bg-[#136cb9]/10 rounded-xl shadow-sm overflow-hidden border border-[#e5e7eb] p-6">
      {/* Header với nút back */}
      <div className="flex items-start justify-between">
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

        <div>
          {isHostEnded && isHost ? (
            <Button
              variant={"custom"}
              className="relative bg-[#136cb9]/60 text-[#136cb9] border-[#136cb9]/20 p-3 overflow-hidden hover:bg-none"
            >
              {/* Background color bar */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#136cb9] to-[#49bbbd] transition-all duration-1000 ease-in-out rounded-md"
                style={{
                  width: "100%",
                  clipPath: `inset(0 ${100 - remainingClubsPercentage}% 0 0)`,
                  animation: `slideIn 1000s ease-in-out forwards `,
                }}
              />
              <style>
                {`
                  @keyframes slideIn {
                    from {
                      clip-path: inset(0 100% 0 0);
                    }
                    to {
                      clip-path: inset(0 ${
                        100 - remainingClubsPercentage
                      }% 0 0);
                    }
                  }

                `}
              </style>
              <span className="relative z-10 text-white">
                {selectedEvent.clubs.every((club) => club.isEnd)
                  ? "ENDED"
                  : `${
                      selectedEvent.clubs.filter((club) => club.isEnd).length
                    } clubs have ended the event`}
              </span>
            </Button>
          ) : isHostEnded ? (
            selectedEvent.status === "ENDED" && (
              <Button
                variant="outline"
                onClick={() => setIsEndEventDialogOpen(true)}
                className="bg-white text-[#136cb9] border-[#136cb9]/20"
              >
                End Event
              </Button>
            )
          ) : (
            // )
            ""
          )}
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
            <span className="text-[#136cb9]">Registration Period: </span>
            <span className="text-gray-700">
              {format(
                new Date(selectedEvent.registeredStartDate),
                "dd/MM/yyyy HH:mm"
              )}{" "}
              -{" "}
              {format(
                new Date(selectedEvent.registeredEndDate),
                "dd/MM/yyyy HH:mm"
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-white shadow-sm">
            <Users className="w-5 h-5 text-[#136cb9]" />
            <span className="text-[#136cb9]">Number of Participants: </span>
            <span className="text-gray-700">
              {selectedEvent.numOfParticipants}/{selectedEvent.maxParticipants}{" "}
              participants
            </span>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="space-y-4 text-base">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white shadow-sm">
            <Building2 className="w-5 h-5 text-[#136cb9]" />
            <span className="text-[#136cb9]">Number of Organizing Clubs:</span>
            <span className="text-gray-700">
              {selectedEvent.clubs?.length || 0} clubs
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white shadow-sm">
            <Money className="w-5 h-5 text-[#136cb9]" />
            <span className="text-[#136cb9]">Price: </span>
            <span className="font-bold text-[#49BBBD]">
              {selectedEvent.price === 0
                ? "Free"
                : `${formatPrice(selectedEvent.price)}`}
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
          <h3 className="text-lg font-semibold mb-3 text-[#136cb9] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#136cb9] " /> Event Areas
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
                      {area.startTime}h - {area.endTime}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dialog xác nhận kết thúc sự kiện */}
      <EndEventDialog
        open={isEndEventDialogOpen}
        onClose={() => setIsEndEventDialogOpen(false)}
        onConfirm={handleEndEvent}
        event={selectedEvent}
        isEnding={isEnding}
        currentClub={currentClub}
      />
    </div>
  );
};
