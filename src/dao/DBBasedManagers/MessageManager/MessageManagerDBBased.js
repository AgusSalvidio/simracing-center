import { Message } from "../../../main/Message/Message.js";
import messageModel from "../../models/message.model.js";

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
      return await messageModel.find({});
    } catch (error) {
      console.error(error.message);
    }
  }

  async getMessagesSortedByTimestamp() {
    try {
      return await this.getMessages().sort({ timestamp: 1 });
    } catch (error) {
      console.error(error.message);
    }
  }
}
