import { Message } from "../dto/Message/Message.js";

export default class MessageRepository {
  constructor(messageDao) {
    this.dao = messageDao;
  }

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

      await this.dao.addMessage(message);
    } catch (error) {
      throw error;
    }
  }

  async getMessagesSortedByTimestamp() {
    try {
      return await this.dao.getMessagesSortedByTimestamp();
    } catch (error) {
      console.error(error.message);
    }
  }
}
