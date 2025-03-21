import { MagicCard } from "@/components/magicui/magic-card";
import { EventSchedule } from "@/models/User";
import { Calendar, Clock, Users2 } from "lucide-react";

interface EventProps {
  events: EventSchedule[];
}

export const EventStatistics = ({ events }: EventProps) => {
  return (
    <div className="container mx-auto px-8 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MagicCard className="p-6 text-center" gradientColor="#E8F4FF">
          <Calendar className="w-8 h-8 mx-auto mb-4 text-[#49BBBD]" />
          <h3 className="text-2xl font-bold text-gray-800">{events.length}</h3>
          <p className="text-gray-600">Registered Events</p>
        </MagicCard>

        <MagicCard className="p-6 text-center" gradientColor="#E8F4FF">
          <Clock className="w-8 h-8 mx-auto mb-4 text-[#49BBBD]" />
          <h3 className="text-2xl font-bold text-gray-800">
            {events.filter((e) => new Date(e.endDate) > new Date()).length}
          </h3>
          <p className="text-gray-600">Upcoming Events</p>
        </MagicCard>

        <MagicCard className="p-6 text-center" gradientColor="#E8F4FF">
          <Users2 className="w-8 h-8 mx-auto mb-4 text-[#49BBBD]" />
          <h3 className="text-2xl font-bold text-gray-800">
            {events.filter((e) => new Date(e.endDate) < new Date()).length}
          </h3>
          <p className="text-gray-600">Completed Events</p>
        </MagicCard>
      </div>
    </div>
  );
};
