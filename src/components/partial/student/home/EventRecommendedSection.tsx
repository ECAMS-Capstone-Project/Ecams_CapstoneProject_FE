import { MagicCard } from "@/components/magicui/magic-card";
import { EventCategoryFilter } from "../events/EventFilter";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import LoadingAnimation from "@/components/ui/loading";
import { GetRecommendedEventsAPI } from "@/api/student/UserPreference";
import { Event } from "@/models/Event";
interface Props {
  userId?: string;
  flag: boolean;
}
export const EventRecommendedSection = ({ userId, flag }: Props) => {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(6);
  const navigate = useNavigate();
  const location = useLocation();
  const [scopeFilter, setScopeFilter] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await GetRecommendedEventsAPI(userId, pageNo, pageSize, scopeFilter.join(","));
      setEvents(response.data?.data || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, scopeFilter, flag]);

  return (
    <section className="py-12">
      <div className="flex justify-between items-center">
        {events.length > 0 && (
          <div className="flex justify-center items-center gap-2">
            <EventCategoryFilter
              value={scopeFilter}
              onChange={(newVal) => {
                setScopeFilter(newVal);
                setPageNo(1);
              }}
            />
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-screen text-xl">
          <LoadingAnimation />
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 text-gray-600">
          <img
            src="https://img.freepik.com/free-vector/flat-prom-background_23-2149365647.jpg"
            alt="No recommended events"
            className="w-28 h-28 mb-4 opacity-90"
          />
          <h3 className="text-2xl font-semibold text-[#136CB5] mb-2">
            No  events right now
          </h3>
          <p className="text-sm max-w-md text-gray-500">
            Currently, we couldn't find any events that match your interests.
            Check back later! 💡
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-7 mt-6 w-full px-8">
        {events.slice(0, 6).map((event, index) => (
          <MagicCard
            key={index}
            className="cursor-pointer w-full max-w-md flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
            gradientColor="#D1EAF0"
            onClick={() =>
              navigate(`/student/events/${event.eventId}`, {
                state: {
                  previousPage: location.pathname,
                  breadcrumb: "Home",
                },
              })
            }
          >
            <div className="w-full p-5 h-auto">
              <img
                src={event.imageUrl}
                alt={event.eventName}
                className="w-full h-auto aspect-auto object-cover rounded-lg mb-4"
              />
              <div className="space-y-4">
                <p className="inline-block italic text-sm font-semibold text-[#2786c6] uppercase">
                  {event.eventAreas && event.eventAreas.length > 0
                    ? event.eventAreas?.map((area) => area.name).join(" & ")
                    : "Have yet to"}
                </p>
                <h3
                  className="text-2xl cursor-pointer font-bold bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent"
                >
                  {event.eventName}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-sm font-semibold text-blue-800 uppercase">
                    {event.eventType || "Unknown"}
                  </span>
                  <span className="text-md text-slate-600 font-medium">
                    {event.price > 0
                      ? event.price.toLocaleString() + " VND"
                      : "Free"}
                  </span>
                </div>
                {event.startDate && event.endDate ? (
                  <div className="flex items-center gap-2 text-md text-slate-600">
                    <CalendarDays size={16} />
                    <span>
                      {format(new Date(event.startDate), "dd/MM/yyyy")} -{" "}
                      {format(new Date(event.endDate), "dd/MM/yyyy")}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">Invalid event dates</p>
                )}
              </div>
            </div>
          </MagicCard>
        ))}
      </div>
      {!isLoading && events.length > 0 && (
        <div className="flex justify-center mt-8 gap-4">
          <button
            disabled={pageNo === 1}
            onClick={() => setPageNo(pageNo - 1)}
            className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 mt-2">Page {pageNo} of {totalPages}</span>
          <button
            disabled={pageNo === totalPages}
            onClick={() => setPageNo(pageNo + 1)}
            className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};
