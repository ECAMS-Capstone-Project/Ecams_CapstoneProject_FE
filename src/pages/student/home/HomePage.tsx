import { ClubsSection } from "@/components/partial/student/home/ClubSection";
import { EventsSection } from "@/components/partial/student/home/EventSection";
import { Hero } from "@/components/partial/student/home/Hero";
import { SearchBar } from "@/components/partial/student/home/SearchBar";

const HomePage = () => {
  return (
    <>
      <div className="mx-0 px-0">
        <Hero />
        <SearchBar />
        <div className="container mx-auto px-4">
          <EventsSection />
          <ClubsSection />
        </div>
      </div>
    </>
  );
};

export default HomePage;
