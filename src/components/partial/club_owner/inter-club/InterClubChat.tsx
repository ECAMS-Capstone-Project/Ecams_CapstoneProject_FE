/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";
import { InterClubEventDTO } from "@/models/Event";

interface InterClubChatProps {
  selectedEvent: InterClubEventDTO | null;
}

export const InterClubChat = ({ selectedEvent }: InterClubChatProps) => {
  const [message, setMessage] = useState("");

  if (!selectedEvent) return null;

  const clubNames =
    selectedEvent?.clubs?.map((club) => club.clubName).join(", ") ||
    "all clubs";

  const [messages, setMessages] = useState([
    {
      id: "1",
      senderId: "system",
      senderName: "System",
      content: `Welcome to the chat room for ${clubNames}! All participating clubs can communicate here.`,
      timestamp: new Date(),
    },
    {
      id: "2",
      senderId: "club1",
      senderName: "Tech Club A",
      content:
        "Hello everyone! Looking forward to collaborating with all of you.",
      timestamp: new Date(),
    },
    {
      id: "3",
      senderId: "club2",
      senderName: "Tech Club B",
      content: "Hi! We're excited to be part of this event.",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: "currentUser", // TODO: Replace with actual user ID
      senderName: "Your Club", // TODO: Replace with actual club name
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-300px)]">
      <ChatHeader
        selectedClub={{
          id: "all",
          name: "All Clubs",
          logo: undefined,
        }}
      />
      <ChatMessages messages={messages} />
      <ChatInput
        message={message}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};
