import { MagicCard } from "@/components/magicui/magic-card";
import { Button } from "@/components/ui/button";

export const EventsSection = () => {
  const events = [
    {
      title:
        "BestSelller Book Bootcamp -write, Market & Publish Your Book -Lucknow",
      location: "New York",
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
    },
    {
      title:
        "BestSelller Book Bootcamp -write, Market & Publish Your Book -Lucknow",
      location: "Los Angeles",
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
    },
    {
      title:
        "BestSelller Book Bootcamp -write, Market & Publish Your Book -Lucknow",
      location: "Chicago",
      img: "https://res.cloudinary.com/ecams/image/upload/v1738836477/b616ac24-b222-4c0f-b454-c7ff867ea445_uhwc1s.png",
    },
    {
      title:
        "BestSelller Book Bootcamp -write, Market & Publish Your Book -Lucknow",
      location: "New York",
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
    },
    {
      title:
        "BestSelller Book Bootcamp -write, Market & Publish Your Book -Lucknow",
      location: "Los Angeles",
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
    },
    {
      title:
        "BestSelller Book Bootcamp -write, Market & Publish Your Book -Lucknow",

      location: "Chicago",
      img: "https://res.cloudinary.com/ecams/image/upload/v1738836477/b616ac24-b222-4c0f-b454-c7ff867ea445_uhwc1s.png",
    },
  ];

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-gray-800">
        Upcoming <span className="text-blue-600">Events</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mt-6 w-full">
        {events.map((event, index) => (
          <MagicCard
            key={index}
            className="cursor-pointer flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 "
            gradientColor="#D1EAF0"
          >
            <div className="w-full p-5">
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-1/2 object-cover rounded-lg"
              />
              <div className="p-4 text-left">
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>
          </MagicCard>
        ))}
      </div>
      <div className="flex w-full justify-center items-center mt-3">
        <Button
          variant="custom"
          className=" p-5 text-white text-md font-normal rounded shadow-lg hover:opacity-95 hover:scale-105 hover:shadow-xl transition duration-300"
        >
          Load More...
        </Button>
      </div>
    </section>
  );
};
