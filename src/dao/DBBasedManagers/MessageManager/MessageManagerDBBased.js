import { Message } from "../../../main/Message/Message.js";
import messageModel from "../../DBBasedManagers/models/message.model.js";

export class MessageManagerDBBased {
  assertSatisfiesAllRequiredParameters = ({
    userEmail,
    message,
    timestamp,
  }) => {
    if (!userEmail || !message || !timestamp)
      throw new Error("Faltan parámetros");
  };

  async initializeMessageUsing({ userEmail, message, timestamp }) {
    try {
      return new Message({
        id: null,
        userEmail,
        message,
        timestamp,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async addMessage(aPotentialMessage) {
    try {
      this.assertSatisfiesAllRequiredParameters(aPotentialMessage);

      const message = await this.initializeMessageUsing(aPotentialMessage);

      messageModel.create(message);
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
      console.error(error.message);
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
      console.error(error.message);
    }
  }
}
