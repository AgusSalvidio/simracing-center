import bcrypt from "bcrypt";

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (password, dbPasswordUser) =>
  bcrypt.compareSync(password, dbPasswordUser);

export { createHash, isValidPassword };
