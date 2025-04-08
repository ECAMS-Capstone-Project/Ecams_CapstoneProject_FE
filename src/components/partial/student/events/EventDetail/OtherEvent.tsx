import { MagicCard } from "@/components/magicui/magic-card";
import { Event } from "@/models/Event";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventProps {
  events: Event[];
  curEventId: string;
  previousPage: string;
  breadcrumbLabel: string;
}
export const OtherEvents = ({
  events,
  curEventId,
  previousPage,
  breadcrumbLabel,
}: EventProps) => {
  const navigate = useNavigate();
  return (
    <section className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-2xl font-bold">Other events you may like</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events &&
            events.length > 0 &&
            events
              .filter((event) => event.eventId !== curEventId)
              .map((event, index) => (
                <MagicCard
                  key={index}
                  className="cursor-pointe w-full max-w-md flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
                  gradientColor="#D1EAF0"
                  onClick={() => navigate(`/student/events/${event.eventId}`, {
                    state: {
                      previousPage: previousPage,
                      breadcrumb: breadcrumbLabel,
                    },
                  })}
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
                          ? event.eventAreas
                            ?.map((area) => area.name)
                            .join(" & ")
                          : "Have yet to"}
                      </p>
                      {/* Tên sự kiện */}
                      <h3
                        className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent"
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
                        <p className="text-sm text-slate-600">
                          Invalid event dates
                        </p>
                      )}
                    </div>
                  </div>
                </MagicCard>
              ))}
        </div>
      </div>
    </section>
  );
};
