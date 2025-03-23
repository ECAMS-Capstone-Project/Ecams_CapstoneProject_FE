import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export const ChatInput = ({
  message,
  onMessageChange,
  onSendMessage,
}: ChatInputProps) => {
  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
        />
        <Button onClick={onSendMessage}>Send</Button>
      </div>
    </div>
  );
};
