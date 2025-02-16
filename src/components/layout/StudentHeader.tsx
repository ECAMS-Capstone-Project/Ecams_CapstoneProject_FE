import useCheckActiveNav from "@/hooks/use-check-active-nav";
import { UserNav } from "../ui/user-nav";
import { Link } from "react-router-dom";

export const StudentHeader = () => {
  const { checkActiveNav } = useCheckActiveNav();
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full px-4 box-border">
      <div className="container mx-auto flex items-center justify-between pb-1">
        <div className="flex justify-center items-center gap-7">
          <img
            src="https://res.cloudinary.com/ecams/image/upload/v1739124259/ECAMS_Logo_ow82lc.png"
            alt="logo"
            className="w-20 h-16 pb-1"
          />
          <nav className="flex space-x-6">
            <Link
              to="/student"
              className={`text-gray-700 font-medium hover:text-[#136CB5] transition duration-300 scroll-smooth ${
                checkActiveNav("/student")
                  ? "font-extrabold text-[#2982cc] "
                  : ""
              }`}
            >
              Home
            </Link>

            <Link
              to="/student/event"
              className={`text-gray-700 font-medium hover:text-[#136CB5] transition ${
                checkActiveNav("/student/event")
                  ? "font-extrabold text-[#2982cc]"
                  : ""
              }`}
            >
              Events
            </Link>

            <Link
              to="/student/club"
              className={`text-gray-700 font-medium hover:text-[#136CB5] transition ${
                checkActiveNav("/student/club")
                  ? "font-extrabold text-[#2982cc]"
                  : ""
              }`}
            >
              Clubs
            </Link>
          </nav>
        </div>
        <div className="flex justify-center items-center gap-2">
          <UserNav />
        </div>
      </div>
    </header>
  );
};
