import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { InterClubEventDTO } from "@/models/Event";

interface InterClubChatProps {
  selectedEvent: InterClubEventDTO | null;
}

export const InterClubChat = ({ selectedEvent }: InterClubChatProps) => {
  if (!selectedEvent) return null;
  const eventEnd = selectedEvent.clubs
    .map((club) => club.isEnd)
    .includes(false) as boolean;

  return eventEnd !== false ? (
    <div className="flex flex-col h-[calc(100vh-300px)]">
      <ChatHeader
        selectedClub={{
          id: "all",
          name: "All Clubs",
          logo: undefined,
        }}
      />
      <ChatMessages eventId={selectedEvent.eventId} />
    </div>
  ) : (
    <div className="flex flex-col h-[calc(100vh-300px)] items-center justify-center">
      <h1 className="text-2xl font-bold text-[#136CB9]">
        Chat data is not existed any more because the event is ended!
      </h1>
    </div>
  );
};
