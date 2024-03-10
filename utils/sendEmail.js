import nodemailer from "nodemailer";
import { config } from "../src/config/config.js";

const { GMAIL_APP_PASS, GMAIL_APP_USER } = config;

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: GMAIL_APP_USER,
    pass: GMAIL_APP_PASS,
  },
});

const sendMail = async (aReceiverEmail, aSubject, aHTML) =>
  await transport.sendMail({
    from: `Simracing Center test <${GMAIL_APP_USER}>`,
    to: aReceiverEmail,
    subject: aSubject,
    html: aHTML,
    attachments: [
      {
        filename: "logo.png",
        path: "public/assets/logo.png",
        cid: "logo",
      },
    ],
  });

export { sendMail };
