import twilio from "twilio";
import { config } from "../src/config/config.js";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = config;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendSMS = (firstName, lastName, phoneNumber) => {
  client.messages.create({
    body: `Gracias por tu compra ${firstName} ${lastName}`,
    from: TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
};

export { sendSMS };
