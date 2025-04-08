import React from "react";
import { format } from "date-fns";
import { Event } from "@/models/Event";
import AreaImageCarousel from "./AreaImage";
import { motion } from "framer-motion";

interface EventDetailRightProps {
  event: Event;
}

export const EventDetailRight: React.FC<EventDetailRightProps> = ({
  event,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="rounded-lg bg-white p-5 shadow">
        <h3 className="mb-2 text-3xl font-semibold">Event location</h3>
        <div className="overflow-x-auto rounded-lg w-full bg-transparent mb-5">
          <table className="min-w-full divide-y divide-gray-200 px-2 rounded-lg">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Area Name
                </th>
                <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {event?.eventAreas?.map((area) => (
                <tr key={area.areaId} className="hover:bg-gray-50">
                  <td className="text-left px-3 py-4 whitespace-nowrap text-md text-gray-900">
                    {area.name}
                  </td>
                  <td className="text-left px-3 py-4 whitespace-nowrap text-md text-gray-900">
                    {format(new Date(area.date), "dd/MM/yyyy")}
                  </td>
                  <td className="text-left px-3 py-4 whitespace-nowrap text-md text-gray-900">
                    {area.startTime}h - {area.endTime}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full p-3">
          <AreaImageCarousel
            area={
              event.eventAreas && event.eventAreas.length > 0
                ? event.eventAreas
                : []
            }
          />
        </div>
      </div>
    </motion.div>
  );
};
