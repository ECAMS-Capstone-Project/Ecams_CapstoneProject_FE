import { UserNav } from "../ui/user-nav";

export const StudentHeader = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full px-4 box-border">
      <div className="container mx-auto flex items-center justify-between pb-1">
        <div className="flex justify-center items-center gap-4">
          <img
            src="https://res.cloudinary.com/ecams/image/upload/v1739124259/ECAMS_Logo_ow82lc.png"
            alt="logo"
            className="w-20 h-16 pb-1"
          />
          <nav className="flex space-x-6">
            <a
              href="#"
              className="text-gray-700 font-medium hover:text-[#136CB5] transition duration-300 scroll-smooth"
            >
              HomePage
            </a>

            <a
              href="/student/event"
              className="text-gray-700 font-medium hover:text-[#136CB5] transition"
            >
              Events
            </a>
            <a
              href="/student/club"
              className="text-gray-700 font-medium hover:text-[#136CB5] transition"
            >
              Clubs
            </a>
          </nav>
        </div>
        <div className="flex justify-center items-center gap-2">
          <UserNav />
        </div>
      </div>
    </header>
  );
};
