import {  useCallback } from 'react';
import { signalRService } from '@/services/signalR';

export const useSignalR = () => {
  const sendMessage = useCallback(async (userId: string, eventId: string, content: string) => {
    await signalRService.sendMessage(userId ,eventId, content);
  }, []);

  const subscribeToMessages = useCallback((callback: (messageId: string, senderName: string, content: string, createdDate: Date, senderId: string) => void) => {
    signalRService.onMessageReceived(callback);
  }, []);

  return {
    sendMessage,
    subscribeToMessages
  };
}; 