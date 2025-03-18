/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Event } from "@/models/Event";
import { useNavigate } from "react-router-dom";

interface DateTimeCardProps {
  event: Event;
}

export const DateTimeCard: React.FC<DateTimeCardProps> = ({ event }) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg bg-white p-7 shadow space-y-6">
      <div className="space-y-4">
        <h3 className="mb-2 text-left text-2xl font-semibold">Date & time</h3>
        <p className="text-gray-700">
          {event?.startDate && event?.endDate
            ? format(new Date(event.startDate), "iiii, PP") +
              " - " +
              format(new Date(event.endDate), "iiii, PP")
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
        <button
          className="w-full p-3.5 mt-0 font-light text-md text-slate-500"
          onClick={() =>
            navigate("/student/events/success", {
              state: {
                event: event,
                previousPage: location.pathname,
                breadcrumb: event.eventName,
              },
            })
          }
        >
          No Refunds
        </button>
      </div>
    </div>
  );
};
