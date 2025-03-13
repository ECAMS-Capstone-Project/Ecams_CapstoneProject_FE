import React from "react";
import { Event } from "@/models/Event";
import { DateTimeCard } from "./DateTimeCard";
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
      <div className="flex justify-between items-center absolute inset-0 px-4">
        <div className="relative z-10 flex h-full flex-col items-start justify-center p-8 text-white md:p-16">
          <h1 className="mb-2 text-5xl font-bold leading-tight">
            {event?.eventName}
          </h1>
          <p className="text-2xl font-semibold">{event?.clubName}</p>
        </div>
        <div className="p-8 m-4">
          <DateTimeCard event={event} />
        </div>
      </div>
    </section>
  );
};
