/* eslint-disable @typescript-eslint/no-unused-vars */
import { MagicCard } from "@/components/magicui/magic-card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EventCategoryFilter } from "./EventFilter";
import { useState } from "react";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import { CalendarDays, ClipboardPenLine, SearchXIcon } from "lucide-react";
import { format } from "date-fns";
import LoadingAnimation from "@/components/ui/loading";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { useLocation, useNavigate } from "react-router-dom";

export const EventSection = () => {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(6);
  const [search, setSearch] = useState("");
  // State cho filter scope (["inside", "outside"]).
  // Có thể là mảng rỗng nếu chưa chọn gì.
  const navigate = useNavigate();
  const location = useLocation();
  const [scopeFilter, setScopeFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const startTime = dateRange.startDate
    ? format(dateRange.startDate, "yyyy-MM-dd")
    : undefined;

  const endTime = dateRange.endDate
    ? format(dateRange.endDate, "yyyy-MM-dd")
    : undefined;
  // Get data from API
  const { getAllEventListQuery } = useEvents();
  const { data: eventData, isLoading } = getAllEventListQuery(
    pageNo,
    search ? 999 : pageSize,
    {
      // Chẳng hạn ta có param "scope" để API filter
      // => Convert scopeFilter thành chuỗi, hoặc pass mảng (tuỳ server).
      type: scopeFilter.join(","),
      startDate: startTime,
      endDate: endTime,
    }
  );
  const events = eventData?.data?.data || [];
  const totalPages = eventData?.data?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    setPageNo(newPage);
  };
  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          <span className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent">
            Events{" "}
          </span>
          around you
        </h2>
      </div>
      <div className="flex justify-between items-center gap-2 mt-4 px-8">
        <Input
          placeholder="Search for event"
          className="rounded-xl px-4 h-10 w-[300px] border-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <EventCategoryFilter
          value={scopeFilter}
          onChange={(newVal) => {
            setScopeFilter(newVal);
            setPageNo(1);
          }}
          dateRange={dateRange}
          onChangeDateRange={(newRange) => {
            setDateRange(newRange);
            setPageNo(1);
          }}
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen text-xl">
          <LoadingAnimation />
        </div>
      ) : !isLoading && (events.length === 0 || filteredEvents.length === 0) ? (
        <div className="flex flex-col items-center justify-center h-64">
          <img
            src="https://img.freepik.com/free-photo/calendar-with-checklist-date-schedule-3d-icon_107791-15691.jpg?t=st=1746267682~exp=1746271282~hmac=2740894c17b97194613de8282bc090acb12be8f6e1d2b5ccd2e2da415cb40f0b&w=1800"
            alt="No clubs"
            className="w-32 h-32 object-cover opacity-90"
          />
          <div className="flex justify-center items-center ">
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
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-7 mt-6 w-full px-8">
          {search
            ? filteredEvents.map((event, index) => (
                <MagicCard
                  key={index}
                  className="h-[500px] cursor-pointe w-full max-w-md flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
                  gradientColor="#D1EAF0"
                  onClick={() =>
                    navigate(`/student/events/${event.eventId}`, {
                      state: {
                        previousPage: location.pathname,
                        breadcrumb: "Event",
                      },
                    })
                  }
                >
                  <div className="w-full p-5 h-full">
                    {/* Hình ảnh */}
                    <img
                      src={event.imageUrl}
                      alt={event.eventName}
                      className="w-full h-[180px] aspect-auto object-cover rounded-lg mb-4"
                    />

                    {/* Nội dung */}
                    <div className="space-y-4">
                      <p className="inline-block italic text-sm font-semibold text-[#2786c6] uppercase">
                        {event.eventAreas && event.eventAreas.length > 0
                          ? event.eventAreas
                              ?.map((area) => area.name)
                              .join(" & ")
                          : "Have yet to"}
                      </p>
                      {/* Tên sự kiện */}
                      <h3
                        onClick={() =>
                          navigate(`/student/events/${event.eventId}`, {
                            state: {
                              previousPage: location.pathname,
                              breadcrumb: "Event",
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
                      <p className="font-semibold text-base">
                        {event?.eventFields?.map((field) => (
                          <span
                            key={field.fieldId}
                            className="px-2 py-1 rounded-md bg-[#136CB5]/20 text-[#136CB5] mr-2"
                          >
                            {field.fieldName}
                          </span>
                        ))}
                      </p>
                      {/* Ngày bắt đầu - kết thúc */}
                      {event.startDate && event.endDate ? (
                        <div className="flex items-center gap-2 text-md text-slate-600">
                          <ClipboardPenLine size={16} />
                          <span>
                            {format(
                              new Date(event.registeredStartDate),
                              "dd/MM/yyyy"
                            )}{" "}
                            -{" "}
                            {format(
                              new Date(event.registeredEndDate),
                              "dd/MM/yyyy"
                            )}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600">
                          Invalid event dates
                        </p>
                      )}
                      {event.startDate && event.endDate ? (
                        <div className="flex items-center gap-2 text-md text-slate-600">
                          <CalendarDays size={16} />
                          <span>
                            {format(new Date(event.startDate), "dd/MM/yyyy")}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600">
                          Invalid event dates
                        </p>
                      )}
                    </div>
                  </div>
                </MagicCard>
              ))
            : events.map((event, index) => (
                <MagicCard
                  key={index}
                  className="h-[500px] cursor-pointe w-full max-w-md flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
                  gradientColor="#D1EAF0"
                  onClick={() => {
                    window.scrollTo(0, 0);

                    navigate(`/student/events/${event.eventId}`, {
                      state: {
                        previousPage: location.pathname,
                        breadcrumb: "Event",
                      },
                    });
                  }}
                >
                  <div className="w-full p-5 h-full">
                    {/* Hình ảnh */}
                    <img
                      src={event.imageUrl}
                      alt={event.eventName}
                      className="w-full h-[180px] aspect-auto object-cover rounded-lg mb-4"
                    />

                    {/* Nội dung */}
                    <div className="space-y-4">
                      <p className="inline-block italic text-sm font-semibold text-[#2786c6] uppercase">
                        {event.eventAreas && event.eventAreas.length > 0
                          ? event.eventAreas
                              ?.map((area) => area.name)
                              .join(" & ")
                          : "Have yet to"}
                      </p>
                      {/* Tên sự kiện */}
                      <h3
                        onClick={() => {
                          window.scrollTo(0, 0);

                          navigate(`/student/events/${event.eventId}`, {
                            state: {
                              previousPage: location.pathname,
                              breadcrumb: "Event",
                            },
                          });
                        }}
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
                      <p className="font-semibold text-base">
                        {event?.eventFields?.map((field) => (
                          <span
                            key={field.fieldId}
                            className="px-2 py-1 rounded-md bg-[#49bbbd]/20 text-[#49bbbd] mr-2"
                          >
                            {field.fieldName}
                          </span>
                        ))}
                      </p>
                      {/* Ngày bắt đầu - kết thúc */}
                      {event.startDate && event.endDate ? (
                        <div className="flex items-center gap-2 text-md text-slate-600">
                          <ClipboardPenLine size={16} /> Registration:
                          <span>
                            {format(
                              new Date(event.registeredStartDate),
                              "dd/MM/yyyy"
                            )}{" "}
                            -{" "}
                            {format(
                              new Date(event.registeredEndDate),
                              "dd/MM/yyyy"
                            )}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600">
                          Invalid event dates
                        </p>
                      )}
                      {event.startDate && event.endDate ? (
                        <div className="flex items-center gap-2 text-md text-slate-600">
                          <CalendarDays size={16} /> Event Date:
                          <span>
                            {format(new Date(event.startDate), "dd/MM/yyyy")}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600">
                          Invalid event dates
                        </p>
                      )}
                    </div>
                  </div>
                </MagicCard>
              ))}
        </div>
      )}

      <div className="flex w-full justify-center items-center mt-5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pageNo - 1)}
                aria-disabled={pageNo === 1}
                tabIndex={pageNo <= 1 ? -1 : undefined}
                className={
                  pageNo <= 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>

            {/* Previous pages */}
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={index + 1 === pageNo}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pageNo + 1)}
                aria-disabled={pageNo === totalPages}
                tabIndex={pageNo === totalPages ? totalPages + 1 : undefined}
                className={
                  pageNo === totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
};
