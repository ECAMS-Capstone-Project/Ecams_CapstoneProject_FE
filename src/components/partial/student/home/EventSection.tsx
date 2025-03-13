import { MagicCard } from "@/components/magicui/magic-card";
import { Button } from "@/components/ui/button";
import { EventCategoryFilter } from "../events/EventFilter";
// import { Input } from "@/components/ui/input";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarDays, SearchXIcon } from "lucide-react";
import LoadingAnimation from "@/components/ui/loading";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import HomePage from "@/pages/student/home/HomePage";

export const EventsSection = () => {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(10);
  // const [, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // const [search, setSearch] = useState("");
  // State cho filter scope (["inside", "outside"]).
  // Có thể là mảng rỗng nếu chưa chọn gì.
  const [scopeFilter, setScopeFilter] = useState<string[]>([]);

  // Get data from API
  const { getAllEventListQuery } = useEvents();
  const { data: eventData, isLoading } = getAllEventListQuery(
    pageNo,
    pageSize,
    {
      // Chẳng hạn ta có param "scope" để API filter
      // => Convert scopeFilter thành chuỗi, hoặc pass mảng (tuỳ server).
      type: scopeFilter.join(","),
    }
  );
  const events = eventData?.data?.data || [];

  // const filteredEvents = events.filter((event) =>
  //   event.eventName.toLowerCase().includes(search.toLowerCase())
  // );
  return (
    <section className="py-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          <span className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent">
            Events{" "}
          </span>
          around you
        </h2>
        <div className="flex justify-center items-center gap-2">
          {/* <Input
            placeholder="Search for event"
            className="rounded-xl px-4 h-10 w-[300px] border-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}
          <EventCategoryFilter
            value={scopeFilter}
            onChange={(newVal) => {
              setScopeFilter(newVal);
              // Mỗi khi filter thay đổi, reset pageNo về 1 (nếu muốn)
              setPageNo(1);
            }}
          />
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center h-screen text-xl">
          <LoadingAnimation />
        </div>
      )}
      {!isLoading && events.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <AnimatedGradientText>
            <SearchXIcon size={26} color="#136CB5" />{" "}
            <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
            <span
              className={
                "inline animate-gradient bg-gradient-to-r from-[#136CB5] via-[#6A5ACD] to-[#49BBBD] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-4xl text-bold"
              }
            >
              No event found!
            </span>
          </AnimatedGradientText>
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-7 mt-6 w-full px-8">
        {events.slice(0, 6).map((event, index) => (
          <MagicCard
            key={index}
            className="cursor-pointe w-full max-w-md flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
            gradientColor="#D1EAF0"
            onClick={() =>
              navigate(`/student/events/${event.eventId}`, {
                state: {
                  previousPage: location.pathname,
                  breadcrumb: HomePage,
                },
              })
            }
          >
            <div className="w-full p-5 h-auto">
              {/* Hình ảnh */}
              <img
                src={event.imageUrl}
                alt={event.eventName}
                className="w-full h-auto aspect-auto object-cover rounded-lg mb-4"
              />

              {/* Nội dung */}
              <div className="space-y-4">
                <p className="inline-block italic text-sm font-semibold text-[#2786c6] uppercase">
                  {event.eventAreas && event.eventAreas.length > 0
                    ? event.eventAreas?.map((area) => area.name).join(" & ")
                    : "Have yet to"}
                </p>
                {/* Tên sự kiện */}
                <h3
                  onClick={() =>
                    navigate(`/student/events/${event.eventId}`, {
                      state: {
                        previousPage: location.pathname,
                        breadcrumb: "Home",
                      },
                    })
                  }
                  className="text-2xl cursor-pointer font-bold bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent"
                >
                  {event.eventName}
                </h3>

                {/* Badge + Giá */}
                <div className="flex items-center gap-2">
                  {/* Badge cho eventType */}
                  <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-sm font-semibold text-blue-800 uppercase">
                    {event.eventType || "Unknown"}
                  </span>
                  {/* Giá */}
                  <span className="text-md text-slate-600 font-medium">
                    {event.price > 0
                      ? event.price.toLocaleString() + " VND"
                      : "Free"}
                  </span>
                </div>

                {/* Ngày bắt đầu - kết thúc */}
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
      <div className="flex w-full justify-center items-center mt-5">
        <Button
          variant="custom"
          className=" p-5 text-white text-md font-normal rounded shadow-lg hover:opacity-95 hover:scale-105 hover:shadow-xl transition duration-300"
          onClick={() => navigate("/student/event")}
        >
          View More...
        </Button>
      </div>
    </section>
  );
};
