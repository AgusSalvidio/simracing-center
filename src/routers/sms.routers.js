import { Router } from "express";
import { sendSMS } from "../../utils/sendSMS.js";

const router = Router();

router.get("/", (req, res) => {
  const firstName = "Prueba";
  const lastName = "Pruebas";
  const phoneNumber = "";

  sendSMS(firstName, lastName, phoneNumber);

  res.send("SMS enviado!");
});

export default router;
