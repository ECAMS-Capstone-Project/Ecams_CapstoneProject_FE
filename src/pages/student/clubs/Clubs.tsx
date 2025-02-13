import { ClubsSection } from "@/components/partial/student/clubs/ClubSection";

export const Clubs: React.FC = () => {
  return (
    <>
      <div className="px-0 md:px-0">
        <section className="relative w-full h-auto min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center bg-black text-white  rounded-2xl px-7">
          <img
            src="https://res.cloudinary.com/ecams/image/upload/v1739348210/1b095c8c-b25c-4c5f-be5f-a921283f52ee_yoc1mq.jpg"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover opacity-50  rounded-xl"
          />
        </section>
        <div className="container mx-auto px-4">
          <ClubsSection />
        </div>
      </div>
    </>
  );
};
