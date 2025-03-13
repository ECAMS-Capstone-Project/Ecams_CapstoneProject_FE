import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Event } from "@/models/Event";

interface DateTimeCardProps {
  event: Event;
}

export const DateTimeCard: React.FC<DateTimeCardProps> = ({ event }) => {
  return (
    <div className="rounded-lg bg-white p-8 shadow space-y-7">
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
        <Button variant="custom" className="w-full p-6 mt-5 font-light text-md">
          Register now
        </Button>
        <button className="w-full p-4 mt-0 font-light text-md text-slate-500">
          No Refunds
        </button>
      </div>
    </div>
  );
};
