import { CreateInterClubEvent } from "@/components/partial/club_owner/inter-club/CreateInterClubEvent";

export const CreateInterClubEventPage = () => {
  return (
    <div className="container mx-auto">
      <div className="bg-gradient-to-r from-[#136CB9]/10 to-[#49BBBD]/10 rounded-xl shadow-sm p-6 mb-6 border border-[#e5e7eb]">
        <h1 className="text-3xl font-bold text-[#136cb9] mb-2">
          Create New Event
        </h1>
        <p className="text-muted-foreground">Create a new inter-club event</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#e5e7eb]">
        <div className="p-6">
          <CreateInterClubEvent />
        </div>
      </div>
    </div>
  );
};
