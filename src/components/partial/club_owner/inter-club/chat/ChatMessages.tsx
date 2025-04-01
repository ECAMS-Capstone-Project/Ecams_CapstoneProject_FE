/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useSignalR } from "@/hooks/useSignalR";
import useAuth from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useMessage } from "@/hooks/club/useMessage";
import { Message } from "@/models/Message";
import { Send } from "lucide-react";

interface ChatMessagesProps {
  eventId: string;
}

export const ChatMessages = ({ eventId }: ChatMessagesProps) => {
  const { messages, refetchMessages } = useMessage(eventId);
  console.log("messages", messages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { sendMessage, subscribeToMessages } = useSignalR();
  const messagesRef = useRef<Set<string>>(new Set());
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    console.log("Setting up chat for event:", eventId);
    const handleNewMessage = (
      messageId: string,
      fullName: string,
      content: string,
      createdDate: Date,
      userId: string
    ) => {
      // Kiểm tra xem tin nhắn đã tồn tại chưa
      if (!messagesRef.current.has(messageId)) {
        console.log("New message received:", {
          messageId,
          fullName,
          content,
          createdDate,
          userId,
        });
        messagesRef.current.add(messageId);
        // Refetch messages để cập nhật danh sách tin nhắn
        refetchMessages();
      }
    };

    subscribeToMessages(handleNewMessage);

    // Cleanup function
    return () => {
      messagesRef.current.clear();
    };
  }, [subscribeToMessages, eventId, refetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.userId) return;

    try {
      setIsLoading(true);
      console.log("Sending message:", {
        userId: user.userId,
        eventId: eventId,
        content: newMessage,
      });

      await sendMessage(user.userId, eventId, newMessage);
      setNewMessage("");
      toast.success("Message sent!");
      // Refetch ngay sau khi gửi tin nhắn thành công
      await refetchMessages();
      console.log("refetch messages", messages);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[600px] min-h-[400px] bg-gray-50 rounded-lg shadow-sm">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
      >
        {Array.isArray(messages) &&
          messages.map((message: Message) => (
            <div
              key={message.messageId}
              className={`flex items-start gap-2.5 ${
                message.userId === user?.userId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.userId !== user?.userId && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {message.fullName.charAt(0)}
                  </span>
                </div>
              )}
              <div
                className={`flex flex-col gap-1 max-w-[70%] ${
                  message.userId === user?.userId ? "items-end" : "items-start"
                }`}
              >
                {message.userId !== user?.userId && (
                  <span className="text-sm font-medium text-gray-800">
                    {message.fullName}
                  </span>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.userId === user?.userId
                      ? "bg-[#136CB9] text-white rounded-tr-none"
                      : "bg-white border border-gray-200 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(message.createdDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {message.userId === user?.userId && (
                <div className="w-8 h-8 rounded-full bg-[#136CB9] flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user.fullname?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="border-t bg-white p-4 rounded-b-lg">
        <form onSubmit={handleSendMessage}>
          <div className="flex gap-2 items-center">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
              disabled={isLoading}
              className="flex-1 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-gray-200"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="shrink-0 bg-[#136CB9] hover:bg-[#0F5A9C] text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
