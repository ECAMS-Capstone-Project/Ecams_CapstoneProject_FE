import React from "react";
import { format } from "date-fns";
import { TicketCheckIcon } from "lucide-react";
import { Event } from "@/models/Event";

interface EventDetailLeftProps {
  event: Event;
}

export const EventDetailLeft: React.FC<EventDetailLeftProps> = ({ event }) => {
  return (
    <div className="md:col-span-2 space-y-12">
      <div className="description">
        <h2 className="mb-4 text-3xl font-bold">Description</h2>
        <p className="mb-4 text-gray-700 text-base leading-relaxed">
          {event?.description}
        </p>
      </div>
      <div className="mb-6 flex items-center gap-6">
        <h2 className="text-3xl font-bold">Price: </h2>
        <span className="inline-flex items-center gap-1 text-2xl font-semibold text-green-800 bg-green-100 rounded-lg px-3 py-1">
          {event?.price && event?.price > 0 ? (
            event.price.toLocaleString() + " VND"
          ) : (
            <>
              FREE <TicketCheckIcon size={20} />
            </>
          )}
        </span>
      </div>
      <div className="mb-6 flex items-center gap-6">
        <h3 className="mb-2 text-3xl font-semibold ">Event type:</h3>
        <span className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-2xl font-semibold text-blue-800 uppercase">
          {event?.eventType || "Unknown"}
        </span>
      </div>
      <div className="mb-6">
        <h3 className="mb-2 text-3xl font-semibold">
          Registered range:
          <span className="ml-3 text-gray-700 text-2xl font-normal">
            {event?.registeredStartDate && event?.registeredEndDate
              ? format(new Date(event.registeredStartDate), "dd/MM/yyyy") +
                " - " +
                format(new Date(event.registeredEndDate), "dd/MM/yyyy")
              : "Invalid date"}
          </span>
        </h3>
      </div>
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Share with friends</h3>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Facebook
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Instagram
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            LinkedIn
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Twitter
          </a>
        </div>
      </div>
    </div>
  );
};
