import { ClubsSection } from "@/components/partial/student/home/ClubSection";
import { EventsSection } from "@/components/partial/student/home/EventSection";
import { Hero } from "@/components/partial/student/home/Hero";
import UserPreferencePopup from "./UserPreferencePopup";
import { EventRecommendedSection } from "@/components/partial/student/home/EventRecommendedSection";
import { useEffect, useState } from "react";
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import LoadingAnimation from "@/components/ui/loading";

const HomePage = () => {
  const [flag, setFlag] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();
  const [isLoading, setIsLoading] = useState<boolean>();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const userInfo = await getCurrentUserAPI();
        if (userInfo) {
          setUserInfo(userInfo.data);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [flag]);

  if (isLoading) return <LoadingAnimation />;

  return (
    <>
      <UserPreferencePopup setFlag={setFlag} flag={flag} user={userInfo} />
      <div className="px-4 py-6">
        <Hero />
        <div className="container mx-auto px-4">
          {userInfo && userInfo.isRecommended !== true ? (
            <EventsSection />
          ) : (
            <>
              <EventRecommendedSection userId={userInfo?.userId} flag={flag} />
            </>
          )}
          <ClubsSection />
        </div>
      </div>
    </>
  );
};

export default HomePage;
