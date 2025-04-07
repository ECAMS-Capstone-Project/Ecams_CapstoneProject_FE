import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@mui/material";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import {
  EventResponse,
  EventStatusEnum,
  GetEventInClubsAPI,
} from "@/api/club-owner/ClubByUser";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import LoadingAnimation from "@/components/ui/loading";
import { EyeIcon } from "lucide-react";

interface Props {
  clubId: string;
  isClubOwner: boolean;
}

export default function EventList({ clubId, isClubOwner }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(5); // Giữ cố định số lượng sự kiện trên mỗi trang
  const [totalPages, setTotalPages] = useState(0);
  const [eventList, setEventList] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  // 🎯 Load danh sách sự kiện từ API
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const eventData = await GetEventInClubsAPI(clubId, pageSize, pageNo);
      if (eventData?.data?.data) {
        setEventList(eventData.data.data);
        setTotalPages(eventData.data.totalPages || 1);
      } else {
        setEventList([]);
      }
    } catch (error) {
      console.error("Error loading events:", error);
      setEventList([]);
    } finally {
      setIsLoading(false);
    }
  }, [clubId, pageNo, pageSize]);

  // 🔥 Tìm kiếm sự kiện trong danh sách đã tải (không gọi API)
  const filteredEvents = eventList.filter((evt) =>
    evt.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* 🔍 Thanh tìm kiếm */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-2/6"
        />
        {isClubOwner && (
          <Button
            onClick={() =>
              navigate("/club/create-event", { state: { clubId } })
            }
            variant={"default"}
          >
            Create event
          </Button>
        )}
      </div>

      {/* 🔄 Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingAnimation />
        </div>
      ) : filteredEvents.length === 0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : (
        <>
          {/* Danh sách sự kiện */}
          <div>
            {filteredEvents.map((evt, index) => (
              <Link
                key={index}
                to={`/events/${evt.eventId}`}
                className="flex items-center  gap-4 rounded-lg bg-white shadow-sm border
                   hover:shadow-md transition cursor-pointer no-underline"
                style={{ height: "105px", marginBottom: "15px" }}
              >
                {/* Avatar của sự kiện */}
                <div
                  className="w-32 h-full flex justify-center items-center"
                  style={{
                    background: "linear-gradient(to right, #136CB5, #49BBBD)",
                    borderTopLeftRadius: "20px",
                    borderBottomLeftRadius: "20px",
                    backgroundImage: `url(${evt.imageUrl})`,
                  }}
                >
                  <img
                    src={
                      evt.imageUrl ||
                      "https://blog.topcv.vn/wp-content/uploads/2021/07/sk2uEvents_Page_Header_2903ed9c-40c1-4f6c-9a69-70bb8415295b.jpg"
                    } // Fake avatar
                    alt="Club Avatar"
                    className="w-20 h-20 rounded-full object-cover mr-4 mb-2 md:mb-0"
                  />
                </div>
                <div className="flex justify-between items-center w-full">
                  {/* Thông tin sự kiện */}
                  <div className="flex flex-col py-2 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-semibold">
                        {evt.eventName}
                      </span>
                      {evt.status === EventStatusEnum.ACTIVE && (
                        <Badge
                          variant="outline"
                          className="border-green-600 text-green-600"
                        >
                          Active
                        </Badge>
                      )}
                    </div>

                    <span className="text-sm text-gray-600">
                      <b>Registration:</b>{" "}
                      {format(evt.registeredStartDate, "dd/MM/yyyy")} -{" "}
                      {format(evt.registeredEndDate, "dd/MM/yyyy")}
                      {" · "}
                      <b>Max:</b> {evt.maxParticipants ?? "N/A"}
                      {" · "}
                      <b>Type:</b> {evt.eventType ?? "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pr-4 z-50 relative w-fit">
                    <Button
                      variant={"custom"}
                      className="z-[1000] w-fit"
                      onClick={() =>
                        navigate(`/club/event-participants/${evt.eventId}`, {
                          state: {
                            eventName: evt.eventName,
                          },
                        })
                      }
                    >
                      <Link
                        to={`/club/event-participants/${evt.eventId}`}
                        className="w-fit flex items-center gap-2"
                      >
                        <EyeIcon size={16} /> View participants
                      </Link>
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 📌 Phân trang */}
          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={pageNo}
              onChange={(_, value) => setPageNo(value)}
              color="primary"
              shape="rounded"
            />
          </div>
        </>
      )}
    </div>
  );
}
