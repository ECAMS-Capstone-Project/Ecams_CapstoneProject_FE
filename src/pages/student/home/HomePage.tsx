import { ClubsSection } from "@/components/partial/student/home/ClubSection";
import { EventsSection } from "@/components/partial/student/home/EventSection";
import { Hero } from "@/components/partial/student/home/Hero";

const HomePage = () => {
  return (
    <>
      <div className="px-4 py-6">
        <Hero />
        <div className="container mx-auto px-4">
          <EventsSection />
          <ClubsSection />
        </div>
      </div>
    </>
  );
};

export default HomePage;
