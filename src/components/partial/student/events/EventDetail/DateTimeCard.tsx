import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Event } from "@/models/Event";
import { useNavigate } from "react-router-dom";
import { Calendar, CalendarCheck } from "lucide-react";

interface DateTimeCardProps {
  event: Event;
}

export const DateTimeCard: React.FC<DateTimeCardProps> = ({ event }) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg bg-white p-8 shadow space-y-6 w-3/4">
      <div className="space-y-4">
        <h3 className="mb-2 text-left text-2xl font-semibold">Date & time</h3>
        <p className="text-gray-700 flex items-center gap-2">
          <Calendar size={18} />
          {event?.startDate
            ? format(new Date(event.startDate), "iiii, PP")
            : "Invalid date"}
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <CalendarCheck size={18} />
          {event?.endDate
            ? format(new Date(event.endDate), "iiii, PP")
            : "Invalid date"}
        </p>
      </div>
      <div>
        <Button
          variant="custom"
          className="w-full p-6 mt-5 font-light text-md"
          onClick={() => {
            if (event.price === 0) {
              // Chuyển event thành plain object
              // const plainEvent = structuredClone
              //   ? structuredClone(event)
              //   : JSON.parse(JSON.stringify(event));
              navigate("/student/events/free-confirmation", {
                state: {
                  event: event,
                  previousPage: location.pathname,
                  breadcrumb: event.eventName,
                },
              });
            } else {
              navigate("/student/events/fee-confirmation", {
                state: {
                  event: event,
                  previousPage: location.pathname,
                  breadcrumb: event.eventName,
                },
              });
            }
          }}
        >
          Register now
        </Button>
      </div>
    </div>
  );
};
