import { MagicCard } from "@/components/magicui/magic-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useClubs } from "@/hooks/student/useClub";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { CalendarDays, SearchXIcon } from "lucide-react";
import { format } from "date-fns";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { useNavigate } from "react-router-dom";

export const ClubsSection = () => {
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize] = useState(5);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { clubs, totalPages } = useClubs(user?.universityId, pageNo, pageSize);
  const handlePageChange = (newPage: number) => {
    setPageNo(newPage);
  };

  const filteredClubs = clubs.filter((club) =>
    club.clubName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          College{" "}
          <span className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] bg-clip-text text-transparent">
            Clubs
          </span>
        </h2>
        <div className="flex justify-center items-center gap-2">
          <Input
            placeholder="Search for club"
            className="rounded-xl px-4 h-10 w-[500px] border-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* <EventCategoryFilter
            value={[]}
            onChange={function (newValue: string[]): void {
              throw new Error("Function not implemented.");
            }}
          /> */}
        </div>
      </div>

      {filteredClubs.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 text-gray-600">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5219/5219073.png"
            alt="No clubs"
            className="w-28 h-28 mb-4 opacity-90"
          />
          <h3 className="text-2xl font-semibold text-[#136CB5] mb-2">
            No clubs matched your search
          </h3>
          <p className="text-sm max-w-sm mb-2 text-gray-500">
            Try adjusting your filters or explore all available clubs.
          </p>
          <AnimatedGradientText className="mt-2">
            <SearchXIcon size={22} className="mr-1" />
            <span className="bg-gradient-to-r from-[#136CB5] via-[#6A5ACD] to-[#49BBBD] bg-clip-text text-transparent text-lg font-bold">
              Nothing found yet!
            </span>
          </AnimatedGradientText>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-7 mt-6 w-full px-8">
        {filteredClubs.map((club, index) => (
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
                        breadcrumb: "Club",
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
      </div>
      <div className="flex w-full justify-center items-center mt-5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pageNo - 1)}
                aria-disabled={pageNo === 1}
                tabIndex={pageNo <= 1 ? -1 : undefined}
                className={
                  pageNo <= 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>

            {/* Previous pages */}
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={index + 1 === pageNo}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pageNo + 1)}
                aria-disabled={pageNo === totalPages}
                tabIndex={pageNo === totalPages ? totalPages + 1 : undefined}
                className={
                  pageNo === totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
};
