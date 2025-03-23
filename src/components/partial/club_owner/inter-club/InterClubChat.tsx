import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClubsList } from "./chat/ClubsList";
import { InterClubEvent } from "@/pages/club-owner/inter-club-event/InterclubEvent";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

interface Club {
  id: string;
  name: string;
  logo?: string;
}

interface InterClubChatProps {
  selectedEvent: InterClubEvent | null;
}

export const InterClubChat = ({ selectedEvent }: InterClubChatProps) => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Implement API calls to fetch clubs and messages
  useEffect(() => {
    // Fetch clubs
    const fetchClubs = async () => {
      if (!selectedEvent) return;

      // TODO: Replace with actual API call
      const mockClubs: Club[] = selectedEvent.participatingClubs.map(
        (clubName) => ({
          id: clubName.toLowerCase().replace(/\s+/g, "-"),
          name: clubName,
          logo: "https://blog.topcv.vn/wp-content/uploads/2021/07/sk2uEvents_Page_Header_2903ed9c-40c1-4f6c-9a69-70bb8415295b.jpg",
        })
      );
      setClubs(mockClubs);
    };

    fetchClubs();
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedClub && selectedEvent) {
      // TODO: Implement real-time chat using WebSocket or similar
      // For now, we'll just mock the messages
      const mockMessages: Message[] = [
        {
          id: "1",
          senderId: "currentUser",
          senderName: "Your Club",
          content: `Hello! Let's discuss about ${selectedEvent.name}`,
          timestamp: new Date(),
        },
        {
          id: "2",
          senderId: selectedClub.id,
          senderName: selectedClub.name,
          content: "Hi there! Sure, let's discuss the event details.",
          timestamp: new Date(),
        },
      ];
      setMessages(mockMessages);
    }
  }, [selectedClub, selectedEvent]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedClub || !selectedEvent) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "currentUser", // TODO: Replace with actual user ID
      senderName: "Your Club", // TODO: Replace with actual club name
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // TODO: Implement API call to send message
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!selectedEvent) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] text-muted-foreground">
        Please select an event to start chatting
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Clubs List - Desktop */}
      <div className="hidden md:block w-64 border-r p-4">
        <ClubsList
          clubs={filteredClubs}
          selectedClub={selectedClub}
          onClubSelect={setSelectedClub}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedClub ? (
          <>
            {/* Chat Header */}
            <ChatHeader selectedClub={selectedClub}>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[300px] p-0">
                  <DialogHeader className="p-4 border-b">
                    <DialogTitle>Select Club</DialogTitle>
                  </DialogHeader>
                  <div className="p-4">
                    <ClubsList
                      clubs={filteredClubs}
                      selectedClub={selectedClub}
                      onClubSelect={setSelectedClub}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </ChatHeader>

            {/* Messages */}
            <ChatMessages messages={messages} />

            {/* Message Input */}
            <ChatInput
              message={message}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a club to start chatting
          </div>
        )}
      </div>
    </div>
  );
};
