import React from "react";
import { Event } from "@/models/Event";
import { DateTimeCard } from "./DateTimeCard";
import { motion } from "framer-motion";
interface HeroSectionProps {
  event: Event;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ event }) => {
  return (
    <section className="relative h-[550px] bg-gray-200 overflow-hidden rounded-[10px]">
      <img
        src={event?.imageUrl}
        alt="Hero"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="grid grid-cols-1 md:grid-cols-2 space-x-10 items-center absolute inset-0 px-4 ml-7">
        <div className="col-span-1 relative z-10 flex h-full flex-col items-start justify-center p-6 text-white md:p-15  w-fit">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white max-w-2xl"
          >
            <h1 className="mb-2 text-5xl font-bold leading-tight w-fit">
              {event?.eventName}
            </h1>
            <p className="text-2xl font-semibold">
              {Array.isArray(event?.clubs)
                ? event?.clubs.map((club) => club.clubName).join(", ")
                : ""}
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 md:mt-0"
        >
          {/* <DateTimeCard club={club} /> */}

          <div className="p-8 m-4 col-span-1 w-full flex justify-evenly">
            <DateTimeCard event={event} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
