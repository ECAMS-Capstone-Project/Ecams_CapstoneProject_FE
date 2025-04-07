import { ClubsSection } from "@/components/partial/student/home/ClubSection";
import { EventsSection } from "@/components/partial/student/home/EventSection";
import { Hero } from "@/components/partial/student/home/Hero";
import UserPreferencePopup from "./UserPreferencePopup";
import useAuth from "@/hooks/useAuth";
import { EventRecommendedSection } from "@/components/partial/student/home/EventRecommendedSection";

const HomePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <UserPreferencePopup />
      <div className="px-4 py-6">
        <Hero />
        <div className="container mx-auto px-4">
          {user?.isRecommended !== true ? (
            <EventsSection />
          ) : (
            <EventRecommendedSection userId={user.userId} />
          )}
          <ClubsSection />
        </div>
      </div>
    </>
  );
};


export default HomePage;
