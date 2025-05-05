/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@mui/material";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { EventResponse, GetEventInClubsAPI } from "@/api/club-owner/ClubByUser";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import LoadingAnimation from "@/components/ui/loading";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";

interface Props {
  clubId: string;
  isClubOwner: boolean;
}

export default function EventList({ clubId, isClubOwner }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [eventList, setEventList] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState("ACTIVE");
  const tabOptions = [
    { label: "Active", value: "ACTIVE" },
    ...(isClubOwner ? [{ label: "Pending", value: "PENDING" }] : []),
    { label: "Not Started", value: "NOT_START" },
    { label: "Ended", value: "ENDED" },
  ];

  const navigate = useNavigate();

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const eventData = await GetEventInClubsAPI(
        clubId,
        pageSize,
        pageNo,
        selectedTab
      );
      if (eventData?.data?.data) {
        setEventList(eventData.data.data);
        setTotalPages(eventData.data.totalPages || 1);
      } else {
        setEventList([]);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [clubId, pageNo, pageSize, selectedTab]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const statusMap = {
    ACTIVE: { className: "border-green-600 text-green-600", label: "Active" },
    ENDED: { className: "border-red-600 text-red-600", label: "Ended" },
    PENDING: {
      className: "border-yellow-500 text-yellow-500",
      label: "Pending",
    },
    ON_GOING: { className: "border-blue-600 text-blue-600", label: "On Going" },
    NOT_START: { className: "border-gray-500 text-black", label: "Not started" },
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Tabs */}
      <div className="flex gap-4 mt-2">
        {tabOptions.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => {
              setSelectedTab(tab.value);
              setPageNo(1); // reset về trang đầu mỗi khi đổi tab
            }}
            variant={selectedTab === tab.value ? "default" : "outline"}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Search + Create */}
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
          >
            Create event
          </Button>
        )}
      </div>

      {/* Loading / Empty / List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingAnimation />
        </div>
      ) : eventList.length === 0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : (
        <>
          <div>
            {eventList.map((evt, index) => {
              const status = statusMap[evt.status as keyof typeof statusMap];
              return (
                <Card
                  key={index}
                  onClick={() => {
                    evt.status !== "PENDING" &&
                      navigate(`/club/event-task/${evt.eventId}`, {
                        state: {
                          isClubOwner,
                          clubId,
                          clubEventId: evt.clubEventId,
                        },
                      });
                  }}
                  className="flex items-center gap-4 rounded-3xl bg-white shadow-md border hover:scale-105 transition cursor-pointer no-underline"
                  style={{ height: "105px", marginBottom: "15px" }}
                >
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
                      }
                      alt="Club Avatar"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col py-2 pr-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-semibold">
                          {evt.eventName}
                        </span>
                        {status && (
                          <Badge variant="outline" className={status.className}>
                            {status.label}
                          </Badge>
                        )}
                      </div>

                      <span className="text-sm text-gray-600">
                        <b>Registration:</b>{" "}
                        {format(evt.registeredStartDate, "dd/MM/yyyy")} -{" "}
                        {format(evt.registeredEndDate, "dd/MM/yyyy")} {" · "}
                        <b>Max:</b> {evt.maxParticipants ?? "N/A"} people{" "}
                        {" · "}
                        <b>Type:</b> {evt.eventType ?? "N/A"}
                      </span>
                    </div>
                    {evt.status == "PENDING" && (
                      <Button
                        variant={"outline"}
                        className="bg-transparent mr-4 border-yellow-500 text-yellow-500 hover:text-yellow-700"
                        onClick={() => {
                          navigate(`/club/detail/update-event/${evt.eventId}`);
                        }}
                      >
                        <Edit className=" cursor-pointer " size={22} />
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

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
