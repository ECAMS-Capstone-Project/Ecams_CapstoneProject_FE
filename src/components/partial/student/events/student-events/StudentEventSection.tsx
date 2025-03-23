import { MagicCard } from "@/components/magicui/magic-card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CalendarDays, SearchXIcon } from "lucide-react";
import { format } from "date-fns";
import LoadingAnimation from "@/components/ui/loading";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { useLocation, useNavigate } from "react-router-dom";
import { useEventSchedule } from "@/hooks/student/useEventRegister";
import useAuth from "@/hooks/useAuth";
import { EventSchedule, UserSchedule } from "@/models/User";
import { EventStatistics } from "./EventStatistics";
import { HeroSection } from "./HeroSection";

export const StudentEventSection = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { studentEvents, isLoading } = useEventSchedule(user?.userId || "");

  const events = (studentEvents as UserSchedule)?.eventSchedules || [];
  const filteredEvents = events.filter((event: EventSchedule) =>
    event.eventName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <HeroSection />
      {/* New Statistics Section */}

      <EventStatistics events={events} />

      <section className="py-12 container mx-auto px-8">
        {events.length > 0 && (
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent">
                Events{" "}
              </span>
              you have registered
            </h2>
            <div className="flex justify-center items-center gap-2">
              <Input
                placeholder="Search for event"
                className="rounded-xl px-4 h-10 w-[300px] border-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingAnimation />
          </div>
        ) : !isLoading && events.length && filteredEvents.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <SearchXIcon size={48} className="text-gray-400" />
            <AnimatedGradientText>
              <span
                className={
                  "inline animate-gradient bg-gradient-to-r from-[#136CB5] via-[#6A5ACD] to-[#49BBBD] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-4xl text-bold"
                }
              >
                No event found!
              </span>
            </AnimatedGradientText>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : !isLoading && events.length === 0 ? (
          <div className="flex justify-center items-center h-full mt-10">
            <AnimatedGradientText>
              <span
                className={
                  "inline animate-gradient bg-gradient-to-r from-[#136CB5] via-[#6A5ACD] to-[#49BBBD] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-4xl text-bold"
                }
              >
                You have not registered for any event yet!
              </span>
            </AnimatedGradientText>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-7 w-full">
            {(search ? filteredEvents : events).map(
              (event: EventSchedule, index: number) => (
                <MagicCard
                  key={index}
                  className="cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  gradientColor="#E8F4FF"
                  onClick={() =>
                    navigate(`/student/events/${event.eventId}`, {
                      state: {
                        previousPage: location.pathname,
                        breadcrumb: "My Event",
                      },
                    })
                  }
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <h3
                        onClick={() =>
                          navigate(`/student/events/${event.eventId}`, {
                            state: {
                              previousPage: location.pathname,
                              breadcrumb: "My Event",
                            },
                          })
                        }
                        className="text-xl font-bold bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent line-clamp-2"
                      >
                        {event.eventName}
                      </h3>
                    </div>

                    {event.startDate && event.endDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                        <CalendarDays size={16} className="text-[#49BBBD]" />
                        <span>
                          {format(new Date(event.startDate), "dd/MM/yyyy")} -{" "}
                          {format(new Date(event.endDate), "dd/MM/yyyy")}
                        </span>
                      </div>
                    )}

                    <div className="pt-2">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          new Date(event.endDate) > new Date()
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {new Date(event.endDate) > new Date()
                          ? "Upcoming"
                          : "Completed"}
                      </span>
                    </div>
                  </div>
                </MagicCard>
              )
            )}
          </div>
        )}
      </section>
    </>
  );
};
