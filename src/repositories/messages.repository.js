import { Message } from "../dto/Message/Message.js";
import CustomError from "../../utils/errors/CustomError.js";
import { generateMessageErrorInfo } from "../../utils/errors/info.js";
import { EErrors } from "../../utils/errors/enums.js";

export default class MessageRepository {
  constructor(messageDao) {
    this.dao = messageDao;
  }

  assertSatisfiesAllRequiredParameters = (aPotentialMessage) => {
    const { userEmail, message, timestamp } = aPotentialMessage;

    if (!userEmail || !message || !timestamp)
      CustomError.createError({
        name: "Message creation failed",
        cause: generateMessageErrorInfo(aPotentialProduct),
        message: "Error creating the message",
        code: EErrors.INSTANCE_CREATION_FAILED,
      });
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
      throw error;
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
      throw error;
    }
  }
}
