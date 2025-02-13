import { MagicCard } from "@/components/magicui/magic-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { EventCategoryFilter } from "../events/EventFilter";

export const ClubsSection = () => {
  const clubs = [
    {
      name: "Harvard University",
      location: "Cambridge, MA",
      rating: 4.8,
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
    },
    {
      name: "Stanford University",
      location: "California",
      rating: 4.6,
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
    },
    {
      name: "Nanyang University",
      location: "Singapore",
      rating: 4.5,
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
    },
    {
      name: "Harvard University",
      location: "Cambridge, MA",
      rating: 4.8,
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
    },
    {
      name: "Stanford University",
      location: "California",
      rating: 4.6,
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
    },
    {
      name: "Nanyang University",
      location: "Singapore",
      rating: 4.5,
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
    },
  ];

  return (
    <section className="py-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          College{" "}
          <span className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent">
            Clubs
          </span>
        </h2>
        <div className="flex justify-center items-center gap-2">
          <Input
            placeholder="Search for club"
            className="rounded-xl px-4 h-10 w-[300px] border-slate-400"
          />
          <EventCategoryFilter />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-7 mt-6 w-full ">
        {clubs.map((club, index) => (
          <MagicCard
            key={index}
            className="cursor-pointer flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 "
            gradientColor="#D1EAF0"
          >
            <div className="w-full ">
              <img
                src={club.img}
                alt={club.name}
                className="w-full h-1/2 object-cover rounded-lg"
              />
              <div className="p-4 text-left flex flex-col gap-6">
                <h3 className="text-lg font-bold">{club.name}</h3>
                <p className="text-gray-600">{club.location}</p>
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-2xl text-sm w-fit">
                  {club.rating} ⭐
                </span>
              </div>
            </div>
          </MagicCard>
        ))}
      </div>
      <div className="flex w-full justify-center items-center mt-5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
};
