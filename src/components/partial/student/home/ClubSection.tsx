import { MagicCard } from "@/components/magicui/magic-card";
import { useClubs } from "@/hooks/student/useClub";
import useAuth from "@/hooks/useAuth";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ClubsSection = () => {
  const [pageNo] = useState(1);
  const [pageSize] = useState(5);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { clubs } = useClubs(user?.universityId, pageNo, pageSize);

  return (
    <section className="py-12 pt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Trending{" "}
          <span className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent">
            Clubs
          </span>
        </h2>
        <div className="flex justify-center items-center gap-2">
          {/* <EventCategoryFilter
            value={[]}
            onChange={function (newValue: string[]): void {
              throw new Error("Function not implemented.");
            }}
          /> */}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-7 mt-6 w-full px-8">
        {clubs.slice(0, 3).map((club, index) => (
          <MagicCard
            key={index}
            className="cursor-pointer flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 "
            gradientColor="#D1EAF0"
          >
            <div className="w-full h-auto">
              <img
                src={club.logoUrl}
                alt={club.clubName}
                className="w-full h-1/4 aspect-video object-cover rounded-lg"
              />
              <div className="p-4 h-3/4 text-left flex flex-col gap-4">
                <h3
                  className="text-2xl font-bold text-[#32aaac]"
                  onClick={() =>
                    navigate(`/student/club/${club.clubId}`, {
                      state: {
                        previousPage: location.pathname,
                        breadcrumb: "Home",
                      },
                    })
                  }
                >
                  {club.clubName}
                </h3>

                <p className="text-[#348687] font-semibold italic">
                  {club.contactEmail || "No Contact Email"}
                </p>

                {/* Mục đích */}
                <p className="text-md text-gray-700 line-clamp-2 truncate max-w-md block">
                  {club.purpose}
                </p>

                {/* <span className="bg-yellow-500 text-white px-2 py-1 rounded-2xl text-sm w-fit">
                  {club.} ⭐
                </span> */}
                <div className="flex flex-wrap gap-2">
                  {club.clubFields?.map((field, i) => (
                    <span
                      key={i}
                      className="bg-[#78e1e33c] text-[#348687] text-sm font-semibold px-2 py-1 rounded-full"
                    >
                      {field.fieldName}
                    </span>
                  ))}
                </div>
                {/* Ngày thành lập */}
                <div className="flex items-center gap-2 text-md text-gray-500">
                  <CalendarDays size={18} />
                  <span>Since {format(club.foundingDate, "dd/MM/yyyy")}</span>
                </div>
              </div>
            </div>
          </MagicCard>
        ))}
        {clubs && clubs.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 text-gray-600">
            <img
              src="https://img.freepik.com/free-vector/flat-prom-background_23-2149365647.jpg"
              alt="No recommended events"
              className="w-28 h-28 mb-4 opacity-90"
            />
            <h3 className="text-2xl font-semibold text-[#136CB5] mb-2">
              No club right now
            </h3>
            <p className="text-sm max-w-md text-gray-500">
              Currently, there is no club at the university. Check back later! 💡
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
