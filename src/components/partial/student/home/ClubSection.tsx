import { MagicCard } from "@/components/magicui/magic-card";

export const ClubsSection = () => {
  const clubs = [
    {
      name: "Harvard University",
      location: "Cambridge, MA",
      rating: 4.8,
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
      numOfEvents: 30,
    },
    {
      name: "Stanford University",
      location: "California",
      rating: 4.6,
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
      numOfEvents: 28,
    },
    {
      name: "Nanyang University",
      location: "Singapore",
      rating: 4.5,
      img: "https://res.cloudinary.com/ecams/image/upload/v1739265664/image3_fwvl15.png",
      numOfEvents: 31,
    },
  ];

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-gray-800">
        Trending{" "}
        <span className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent">
          Clubs
        </span>
      </h2>

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
                <div className="flex justify-end items-center">
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-2xl text-sm w-fit">
                    {club.rating} ⭐
                  </span>
                  <span className=" text-gray-500 px-2 py-1 rounded-2xl text-sm w-fit">
                    ({club.numOfEvents})
                  </span>
                </div>
              </div>
            </div>
          </MagicCard>
        ))}
      </div>
    </section>
  );
};
