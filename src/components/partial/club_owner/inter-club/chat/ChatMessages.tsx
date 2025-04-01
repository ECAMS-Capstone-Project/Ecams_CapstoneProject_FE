import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  return (
    <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-white to-[#f8f9fa]">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex animate-in fade-in slide-in-from-bottom-4 duration-300",
              msg.senderId === "currentUser" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-2xl p-3 shadow-sm transition-all duration-200 hover:shadow-md",
                msg.senderId === "currentUser"
                  ? "bg-[#136cb9] text-white rounded-br-none"
                  : "bg-white text-[#333] rounded-bl-none border border-[#e5e7eb]"
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium mb-1",
                  msg.senderId === "currentUser"
                    ? "text-white/90"
                    : "text-[#136cb9]"
                )}
              >
                {msg.senderName}
              </p>
              <p className="text-[15px] leading-relaxed">{msg.content}</p>
              <p
                className={cn(
                  "text-xs mt-1",
                  msg.senderId === "currentUser"
                    ? "text-white/70"
                    : "text-gray-500"
                )}
              >
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
