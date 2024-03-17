import { Router } from "express";
import { sendMail } from "../../utils/sendEmail.js";

const router = Router();

router.get("/", (req, res) => {
  const receiver = "agustinsalvidio@gmail.com";
  const subject = "Email de prueba Simracing Center";
  const html = "<div><h1>Email de prueba</h1></div>";

  sendMail(receiver, subject, html);

  res.send("Mail enviado!");
});

export default router;
