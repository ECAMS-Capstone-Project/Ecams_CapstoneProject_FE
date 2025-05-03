import { MagicCard } from "@/components/magicui/magic-card";
import { useNavigate } from "react-router-dom";
import { ClubResponse } from "@/models/Club";
import { motion } from "framer-motion";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

interface TopEventProps {
  club: ClubResponse;
}

export const TopEvents = ({ club }: TopEventProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:col-span-2 space-y-8"
    >
      <div className="social-share">
        <h3 className="text-2xl font-bold mb-4">Top Events</h3>
        {club?.topEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64">
            <img
              src="https://img.freepik.com/premium-vector/events-big-text-online-corporate-party-meeting-friends-colleagues-video-conference_501813-9.jpg?w=1800"
              alt="No clubs"
              className="w-44 h-44  object-contain opacity-90"
            />
            <div className="flex justify-center items-center ">
              <AnimatedGradientText>
                <span
                  className={
                    "inline animate-gradient bg-gradient-to-r from-[#136CB5] via-[#6A5ACD] to-[#49BBBD] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-4xl text-bold"
                  }
                >
                  No top event yet!
                </span>
              </AnimatedGradientText>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-7 mt-6 w-full px-8">
          {club?.topEvents.map((event, index) => (
            <MagicCard
              key={index}
              className="h-[450px] cursor-pointe w-full max-w-md flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
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
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {event.numOfFeedbacks > 0 ? (
                      <>
                        <span>⭐ {event.averageRating?.toFixed(1)}</span>
                        <span>·</span>
                        <span>{event.numOfFeedbacks} feedbacks</span>
                      </>
                    ) : (
                      <span>No feedback yet</span>
                    )}
                  </div>

                  <p className="font-semibold text-base">
                    {event.eventFields &&
                      event.eventFields.map((field) => (
                        <span
                          key={field.fieldId}
                          className="px-2 py-1 rounded-md bg-[#49bbbd]/20 text-[#49bbbd] mr-2"
                        >
                          {field.fieldName}
                        </span>
                      ))}
                  </p>

                  {/* Badge + Giá */}
                  <div className="flex items-center justify-between gap-2">
                    {/* Badge cho eventType */}
                    <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-sm font-semibold text-blue-800 uppercase">
                      {event.eventType || "Unknown"}
                    </span>
                    {/* Giá */}
                    <span
                      className={`text-sm font-semibold py-1 px-2 rounded-full ${
                        event.status == "ACTIVE"
                          ? "bg-[#CBF2DA] text-[#2F4F4F]"
                          : "bg-[#D1E7F3] text-[#1E4A7D]"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            </MagicCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
