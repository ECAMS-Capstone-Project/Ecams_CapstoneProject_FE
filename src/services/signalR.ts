import * as signalR from "@microsoft/signalr";

class SignalRService {
  private connection: signalR.HubConnection | null = null;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5214/chatHub") // URL của hub
      .withAutomaticReconnect()
      .build();

    this.connection.on("ReceiveMessage", (messageId: string, fullName: string, content: string, createdDate: Date, eventId: string, userId: string) => {
      console.log("Received message from server:", { messageId, fullName, content, createdDate, eventId, userId });
    });

    this.connection.on("ReceiveError", (error: string) => {
      console.error("Error from server:", error);
    });

    this.startConnection();
  }

  private async startConnection() {
    try {
      await this.connection?.start();
      console.log("SignalR Connected Successfully!");
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
    }
  }

  public async sendMessage(userId: string, eventId: string, content: string) {
    try {
      console.log("Sending message:", { userId, eventId, content });
      await this.connection?.invoke("SendMessage", userId, eventId, content);
      console.log("Message sent successfully");
    } catch (err) {
      console.error("Error sending message: ", err);
      throw err; // Throw error để component có thể bắt và xử lý
    }
  }

  public async deleteMessage(messageId: string, userId: string) {
    try {
      console.log("Deleting message:", { messageId, userId });
      await this.connection?.invoke("DeleteMessage", messageId, userId);
      console.log("Message deleted successfully");
    } catch (err) {
      console.error("Error deleting message: ", err);
      throw err;
    }
  }

  public async updateMessage(userId: string, messageId: string, content: string) {
    try {
      console.log("Updating message:", { userId, messageId, content });
      await this.connection?.invoke("UpdateMessage", userId, messageId, content);
      console.log("Message updated successfully");
    } catch (err) {
      console.error("Error updating message: ", err);
      throw err;
    }
  }

  public onMessageReceived(callback: (messageId: string, senderName: string, content: string, createdDate: Date, userId: string) => void) {
    console.log("Setting up message listener");
    this.connection?.on("ReceiveMessage", (messageId: string, senderName: string, content: string, createdDate: Date, eventId: string, userId: string) => {
      callback(messageId, senderName, content, createdDate, userId);
    });
  }

  public onMessageDeleted(callback: (messageId: string) => void) {
    this.connection?.on("MessageDeleted", callback);
  }

  public onMessageUpdated(callback: (messageId: string, content: string) => void) {
    this.connection?.on("MessageUpdated", callback);
  }

  public onError(callback: (error: string) => void) {
    this.connection?.on("ReceiveError", callback);
  }

  public disconnect() {
    this.connection?.stop();
  }
}

export const signalRService = new SignalRService(); 