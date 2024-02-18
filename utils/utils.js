import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import brcypt from "bcrypt";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/public/images`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ storage });

const createHash = (password) =>
  brcypt.hashSync(password, brcypt.genSaltSync(10));

const isValidPassword = (password, dbPasswordUser) =>
  brcypt.compareSync(password, dbPasswordUser);

export { uploader, createHash, isValidPassword };

export default __dirname;
