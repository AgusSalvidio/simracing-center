import { Message } from "../../../dto/Message/Message.js";
import messageModel from "../../DBBasedManagers/models/message.model.js";

export class MessageManagerDBBased {
  async addMessage(aPotentialMessage) {
    try {
      await messageModel.create(aPotentialMessage);
    } catch (error) {
      throw error;
    }
  }

  async getMessages() {
    try {
      const messages = await messageModel.find({});
      const parsedMessages = messages.map((message) => new Message(message));
      return parsedMessages;
    } catch (error) {
      throw error;
    }
  }

  async getMessagesSortedByTimestamp() {
    try {
      const messages = await this.getMessages();
      const sortedMessages = messages.sort(
        (message, anotherMessage) =>
          message.timestamp - anotherMessage.timestamp
      );
      return sortedMessages;
    } catch (error) {
      throw error;
    }
  }
}
