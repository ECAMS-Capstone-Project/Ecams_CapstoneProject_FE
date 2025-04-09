import { ClubsSection } from "@/components/partial/student/home/ClubSection";
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
          <h2 className="text-3xl font-bold text-gray-800 mt-8">
            <span className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent">
              Events{" "}
            </span>
            around you
          </h2>
          {userInfo && userInfo.isRecommended !== true ? (
            <div className="flex flex-col items-center justify-center text-center mt-20 mb-24 text-gray-600">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="Not recommended"
                className="w-24 h-24 mb-4 opacity-80"
              />
              <h2 className="text-xl font-semibold mb-2">No event recommendations</h2>
              <p className="text-sm max-w-md">
                You have opted out of personalized event recommendations. If you change your mind, you can turn it back on in your preferences 🎯
              </p>
            </div>
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
