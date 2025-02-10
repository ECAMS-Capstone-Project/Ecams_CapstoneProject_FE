import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FileTextIcon, Share2Icon } from "lucide-react";

export const features = [
  {
    Icon: FileTextIcon,
    name: "Easy Connection",
    description:
      "Find and connect with students & organizations easily. Engage in forums, discussions, and group collaborations effortlessly.",
    href: "#",
    cta: "Learn more",
    className:
      "col-span-3 sm:col-span-1 flex flex-col items-center text-center",
    background: (
      <div className="absolute top-0 left-0 right-0 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] ">
        <img
          src="https://res.cloudinary.com/ecams/image/upload/v1739170806/unsplash_ugaOk9LkmQY_l2jbgn.png"
          alt=""
          className="w-full object-cover"
        />
      </div>
    ),
  },

  {
    Icon: Share2Icon,
    name: "Exclusive Events",
    description:
      "Gain access to exclusive events, workshops, and networking opportunities. Participate in special webinars and career fairs.",
    href: "#",
    cta: "Learn more",
    className:
      "col-span-3 sm:col-span-1 flex flex-col items-center text-center",
    background: (
      <div className="absolute top-0 left-0 right-0 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] ">
        <img
          src="https://res.cloudinary.com/ecams/image/upload/v1739189258/unsplash_qfWMUXDcN18_wq7oep.png"
          alt=""
          className="w-full object-cover"
        />
      </div>
    ),
  },
  {
    Icon: CalendarIcon,
    name: "Community Engagement",
    description:
      "Engage with student communities through interactive calendars and discussion forums. Organize meetups and collaborative projects.",

    className:
      "col-span-3 sm:col-span-1 flex flex-col items-center text-center",
    href: "#",
    cta: "Learn more",
    background: (
      <Calendar
        mode="single"
        selected={new Date()}
        className="absolute right-0 top-10 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
      />
    ),
  },
];
