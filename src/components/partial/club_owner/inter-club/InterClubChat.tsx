import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { InterClubEventDTO } from "@/models/Event";

interface InterClubChatProps {
  selectedEvent: InterClubEventDTO | null;
}

export const InterClubChat = ({ selectedEvent }: InterClubChatProps) => {
  if (!selectedEvent) return null;

  return (
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
  );
};
