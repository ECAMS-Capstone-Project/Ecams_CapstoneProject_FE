import React from "react";
import { format } from "date-fns";
import { TicketCheckIcon } from "lucide-react";
import { Event } from "@/models/Event";
import { motion } from "framer-motion";
import InviteFriendPage from "./ShareEvent";

interface EventDetailLeftProps {
  event: Event;
}

export const EventDetailLeft: React.FC<EventDetailLeftProps> = ({ event }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:col-span-1 space-y-8"
    >
      <div className="md:col-span-1 space-y-12">
        <div className="description">
          <h2 className="mb-4 text-3xl font-bold">Description</h2>
          <p className="mb-4 text-gray-700 text-lg leading-relaxed">
            {event?.description}
          </p>
          <p className="mb-4 text-[#368e90] text-lg leading-relaxed italic">
            If you join this event, you will get{" "}
            <span className="font-bold">{event?.trainingPoint}</span> training
            points
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
        <div className="social-share">
          <h3 className="text-2xl font-bold mb-4">Share with Friends</h3>
          <div className="flex items-center space-x-4">
            <InviteFriendPage />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
