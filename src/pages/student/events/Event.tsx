import { HeroSection } from "@/components/layout/HeroSection";
import { EventSection } from "@/components/partial/student/events/EventSection";

export const Event: React.FC = () => {
  return (
    <>
      <div className="px-0 md:px-0">
        <HeroSection />
        <div className="container mx-auto px-4">
          <EventSection />
        </div>
      </div>
    </>
  );
};
