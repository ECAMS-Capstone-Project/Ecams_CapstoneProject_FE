import { GetEventSingleTask } from "@/api/club-owner/TaskAPI";
import { EventItemOverView } from "@/components/partial/club_owner/event-task-overview/EventItemOverView";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import { EventSingleClubTask } from "@/models/Event";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CalendarX, SearchX, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5;

export function EventTaskOverViewList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [listEvent, setListEvent] = useState<EventSingleClubTask[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [status, setStatus] = useState<string>("ACTIVE");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const EventList = async () => {
      try {
        if (user?.userId) {
          setIsLoading(true);
          const eventList = await GetEventSingleTask(user.userId, currentPage, ITEMS_PER_PAGE, debouncedSearch, status);
          if (eventList) {
            setListEvent(eventList.data?.data || []);
            setTotalPages(eventList.data?.totalPages || 1);
          }
        }
      } catch (error) {
        console.error("Failed to fetch event list", error);
      } finally {
        setIsLoading(false);
      }
    };
    EventList();
  }, [user?.userId, currentPage, debouncedSearch, status]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleStatusChange = (newStatus: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setStatus(newStatus);
    }, 1000);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Title + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ textAlign: "left" }}
        >
          <Box
            component="span"
            sx={{
              background: "linear-gradient(to right, #136CB5, #49BBBD)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
          >
            Task list in
          </Box>{" "}
          <Box component="span" sx={{ color: "#444" }}>
            event
          </Box>
        </Typography>
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[300px]"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <Tabs
          value={status}
          onValueChange={handleStatusChange}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 p-1 rounded-xl">
            <TabsTrigger value="ACTIVE">
              Active
            </TabsTrigger>
            <TabsTrigger value="CANCELED">
              Cancelled
            </TabsTrigger>
            <TabsTrigger value="ENDED">
              Ended
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <l-pinwheel
              size="35"
              stroke="3.5"
              speed="0.9"
              color="#136CB5"
            ></l-pinwheel>
          </div>
        ) : listEvent.length > 0 ? (
          listEvent.map((event, index) => (
            <EventItemOverView
              key={index}
              imageUrl={event.imageUrl}
              eventName={event.eventName}
              description={event.description}
              startDate={event.registeredStartDate}
              endDate={event.registeredEndDate}
              numOfParticipants={event.maxParticipants}
              status={event.status}
              numberOfTasks={event.numOfTasks}
              price={event.price}
              clubEventId={event.clubEventId}
              clubs2={event.clubs}
              eventId={event.eventId}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-b from-white to-gray-50/50 rounded-2xl shadow-sm border border-gray-100">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-[#136CB5]/10 to-[#49BBBD]/10 rounded-full animate-pulse" />
              {search ? (
                <SearchX className="w-20 h-20 text-gray-400" />
              ) : (
                <CalendarX className="w-20 h-20 text-gray-400" />
              )}
            </div>
            <Typography
              variant="h5"
              className="mb-3 font-semibold bg-gradient-to-r from-[#136CB5] to-[#49BBBD] bg-clip-text text-transparent"
            >
              {search ? "No matching events found" : "No events in this status"}
            </Typography>
            <Typography variant="body1" color="text.secondary" className="max-w-md">
              {search
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "There are currently no events in this status. Check back later or try a different status."}
            </Typography>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-6 gap-4 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm font-medium bg-gray-50 px-4 py-2 rounded-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
