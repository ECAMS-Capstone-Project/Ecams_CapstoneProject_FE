import React from "react";
import { useLocation, useParams } from "react-router-dom";
import LoadingAnimation from "@/components/ui/loading";
import { BreadcrumbNav } from "./BreadcrumbNav";
import { HeroSection } from "./HeroSection";
import { useClubs } from "@/hooks/student/useClub";
import { ClubDetailLeft } from "./ClubDetailLeft";
import { ClubDetailRight } from "./ClubDetailRight";
import useAuth from "@/hooks/useAuth";

export const StudentClubDetail: React.FC = () => {
  // const [pageNo] = useState(1);
  // const [pageSize] = useState(7);
  const { clubId = "" } = useParams();
  const { getClubDetailQuery, checkIsInClubQuery } = useClubs();
  const location = useLocation();
  const { user } = useAuth();
  // Lấy thông tin trang trước (truyền qua state khi navigate)
  const previousPage = location.state?.previousPage || "/student/event";
  const breadcrumbLabel = location.state?.breadcrumb || "Event";

  const { data: ClubDetail, isLoading: isEventDetailLoading } =
    getClubDetailQuery(clubId);
  // const { data: eventData } = getAllEventListQuery(pageNo, pageSize);
  const { data: isInClub, refetch } = checkIsInClubQuery(
    user?.userId || "",
    clubId
  );
  if (isEventDetailLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <LoadingAnimation />
      </div>
    );
  }
  console.log(isInClub?.data?.isMember);
  const club = ClubDetail?.data;
  // const events = eventData?.data?.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <BreadcrumbNav
            previousPage={previousPage}
            breadcrumbLabel={breadcrumbLabel}
            eventName={club?.clubName}
          />
        </div>
      </div>

      <main className="relative">
        {club && (
          <HeroSection
            club={club}
            isInClub={
              isInClub?.data || { isMember: false, hasPendingRequest: false }
            }
            refetch={refetch}
          />
        )}

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {club && <ClubDetailLeft club={club} />}
              {club && <ClubDetailRight club={club} />}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Phần này có thể thêm các sự kiện liên quan hoặc câu lạc bộ tương tự */}
        </div>
      </main>
    </div>
  );
};

export default StudentClubDetail;
