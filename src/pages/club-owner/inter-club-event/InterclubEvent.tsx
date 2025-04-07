import { InterClubEventList } from "@/components/partial/club_owner/inter-club/InterClubEventList";
import { useNavigate } from "react-router-dom";

export const InterClubEvent = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto ">
      <div className="bg-gradient-to-r from-[#136CB9]/10 to-[#49BBBD]/10 rounded-xl shadow-sm p-6 mb-6 border border-[#e5e7eb]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#136cb9] mb-2">
              Inter-Club Event Management
            </h1>
            <p className="text-muted-foreground">
              Manage and collaborate on inter-club events
            </p>
          </div>
          <button
            onClick={() => navigate("/club/inter-club-event/create")}
            className="px-4 py-2 bg-[#136cb9] text-white rounded-lg hover:bg-[#136cb9]/90 transition-colors duration-200"
          >
            Create New Event
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#e5e7eb]">
        <div className="p-6">
          <InterClubEventList />
        </div>
      </div>
    </div>
  );
};
